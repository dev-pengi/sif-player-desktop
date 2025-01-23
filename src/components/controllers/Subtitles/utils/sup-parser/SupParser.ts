import { fs } from "../../../../../utils";


// Constants for Segments
const PDS = 0x14;
const ODS = 0x15;
const PCS = 0x16;
const WDS = 0x17;
const END = 0x80;

// Named tuple access for static PDS palettes
class Palette {
  constructor(
    public Y: number,
    public Cr: number,
    public Cb: number,
    public Alpha: number
  ) {}
}

class InvalidSegmentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSegmentError";
  }
}

export default class PGSReader {
  private _segments: BaseSegment[] = [];
  private _displaysets: DisplaySet[] = [];

  constructor(private filepath: string) {
    this.bytes = fs.readFileSync(filepath);
  }

  private bytes: Buffer;

  private makeSegment(bytes: Buffer): BaseSegment {
    const cls = SEGMENT_TYPE[bytes[10]];
    return new cls(bytes);
  }

  *iterSegments(): Generator<BaseSegment> {
    let bytes = this.bytes;
    while (bytes.length > 0) {
      const size = 13 + bytes.readUInt16BE(11);
      yield this.makeSegment(bytes.slice(0, size));
      bytes = bytes.slice(size);
    }
  }

  *iterDisplaysets(): Generator<DisplaySet> {
    let ds: BaseSegment[] = [];
    for (const s of this.iterSegments()) {
      ds.push(s);
      if (s.type === "END") {
        yield new DisplaySet(ds);
        ds = [];
      }
    }
  }

  get segments(): BaseSegment[] {
    if (this._segments.length === 0) {
      this._segments = Array.from(this.iterSegments());
    }
    return this._segments;
  }

  get displaysets(): DisplaySet[] {
    if (this._displaysets.length === 0) {
      this._displaysets = Array.from(this.iterDisplaysets());
    }
    return this._displaysets;
  }
}

class BaseSegment {
  static SEGMENT: { [key: number]: string } = {
    [PDS]: "PDS",
    [ODS]: "ODS",
    [PCS]: "PCS",
    [WDS]: "WDS",
    [END]: "END",
  };

  type: string;
  size: number;
  data: Buffer;

  constructor(public bytes: Buffer) {
    if (bytes.slice(0, 2).toString() !== "PG") {
      throw new InvalidSegmentError("Invalid segment");
    }
    this.pts = bytes.readUInt32BE(2) / 90;
    this.dts = bytes.readUInt32BE(6) / 90;
    this.type = BaseSegment.SEGMENT[bytes[10]];
    this.size = bytes.readUInt16BE(11);
    this.data = bytes.slice(13);
  }

  pts: number;
  dts: number;

  get presentationTimestamp(): number {
    return this.pts;
  }

  get decodingTimestamp(): number {
    return this.dts;
  }

  get segmentType(): string {
    return this.type;
  }
}

class CompositionObject {
  objectId: number;
  windowId: number;
  cropped: boolean;
  xOffset: number;
  yOffset: number;
  cropXOffset?: number;
  cropYOffset?: number;
  cropWidth?: number;
  cropHeight?: number;

  constructor(bytes: Buffer) {
    this.objectId = bytes.readUInt16BE(0);
    this.windowId = bytes[2];
    this.cropped = Boolean(bytes[3]);
    this.xOffset = bytes.readUInt16BE(4);
    this.yOffset = bytes.readUInt16BE(6);
    if (this.cropped) {
      this.cropXOffset = bytes.readUInt16BE(8);
      this.cropYOffset = bytes.readUInt16BE(10);
      this.cropWidth = bytes.readUInt16BE(12);
      this.cropHeight = bytes.readUInt16BE(14);
    }
  }
}

class PresentationCompositionSegment extends BaseSegment {
  static STATE: { [key: number]: string } = {
    0x00: "Normal",
    0x40: "Acquisition Point",
    0x80: "Epoch Start",
  };

  width: number;
  height: number;
  frameRate: number;
  private _num: number;
  private _state: string;
  paletteUpdate: boolean;
  paletteId: number;
  private _numComps: number;

  constructor(bytes: Buffer) {
    super(bytes);
    this.width = this.data.readUInt16BE(0);
    this.height = this.data.readUInt16BE(2);
    this.frameRate = this.data[4];
    this._num = this.data.readUInt16BE(5);
    this._state = PresentationCompositionSegment.STATE[this.data[7]];
    this.paletteUpdate = Boolean(this.data[8]);
    this.paletteId = this.data[9];
    this._numComps = this.data[10];
  }

  get compositionNumber(): number {
    return this._num;
  }

  get compositionState(): string {
    return this._state;
  }

  private _compositionObjects: CompositionObject[] = [];

  get compositionObjects(): CompositionObject[] {
    if (this._compositionObjects.length === 0) {
      this._compositionObjects = this.getCompositionObjects();
      if (this._compositionObjects.length !== this._numComps) {
        console.warn(
          "Warning: Number of composition objects asserted does not match the amount found."
        );
      }
    }
    return this._compositionObjects;
  }

  private getCompositionObjects(): CompositionObject[] {
    let bytes = this.data.slice(11);
    const comps: CompositionObject[] = [];
    while (bytes.length > 0) {
      const length = 8 * (1 + Number(bytes[3])); // Convert boolean to number
      comps.push(new CompositionObject(bytes.slice(0, length)));
      bytes = bytes.slice(length);
    }
    return comps;
  }
}

class WindowDefinitionSegment extends BaseSegment {
  numWindows: number;
  windowId: number;
  xOffset: number;
  yOffset: number;
  width: number;
  height: number;

  constructor(bytes: Buffer) {
    super(bytes);
    this.numWindows = this.data[0];
    this.windowId = this.data[1];
    this.xOffset = this.data.readUInt16BE(2);
    this.yOffset = this.data.readUInt16BE(4);
    this.width = this.data.readUInt16BE(6);
    this.height = this.data.readUInt16BE(8);
  }
}

class PaletteDefinitionSegment extends BaseSegment {
  paletteId: number;
  version: number;
  palette: Palette[];

  constructor(bytes: Buffer) {
    super(bytes);
    this.paletteId = this.data[0];
    this.version = this.data[1];
    this.palette = new Array(256).fill(new Palette(0, 0, 0, 0));
    for (let entry = 0; entry < (this.data.length - 2) / 5; entry++) {
      const i = 2 + entry * 5;
      this.palette[this.data[i]] = new Palette(
        this.data[i + 1],
        this.data[i + 2],
        this.data[i + 3],
        this.data[i + 4]
      );
    }
  }
}

class ObjectDefinitionSegment extends BaseSegment {
  static SEQUENCE: { [key: number]: string } = {
    0x40: "Last",
    0x80: "First",
    0xc0: "First and last",
  };

  id: number;
  version: number;
  inSequence: string;
  dataLen: number;
  width: number;
  height: number;
  imgData: Buffer;

  constructor(bytes: Buffer) {
    super(bytes);
    this.id = this.data.readUInt16BE(0);
    this.version = this.data[2];
    this.inSequence = ObjectDefinitionSegment.SEQUENCE[this.data[3]];
    this.dataLen = this.data.readUIntBE(4, 3);
    this.width = this.data.readUInt16BE(7);
    this.height = this.data.readUInt16BE(9);
    this.imgData = this.data.slice(11);
    if (this.imgData.length !== this.dataLen - 4) {
      console.warn(
        "Warning: Image data length asserted does not match the length found."
      );
    }
  }
}

class EndSegment extends BaseSegment {
  get isEnd(): boolean {
    return true;
  }
}

const SEGMENT_TYPE: { [key: number]: typeof BaseSegment } = {
  [PDS]: PaletteDefinitionSegment,
  [ODS]: ObjectDefinitionSegment,
  [PCS]: PresentationCompositionSegment,
  [WDS]: WindowDefinitionSegment,
  [END]: EndSegment,
};

class DisplaySet {
  segments: BaseSegment[];
  segmentTypes: string[];
  hasImage: boolean;

  // Explicitly define dynamic properties
  pds: BaseSegment[];
  ods: BaseSegment[];
  pcs: BaseSegment[];
  wds: BaseSegment[];
  end: BaseSegment[];

  constructor(segments: BaseSegment[]) {
    this.segments = segments;
    this.segmentTypes = segments.map((s) => s.type);
    this.hasImage = this.segmentTypes.includes("ODS");

    // Initialize dynamic properties
    this.pds = this.segments.filter((s) => s.type === "PDS");
    this.ods = this.segments.filter((s) => s.type === "ODS");
    this.pcs = this.segments.filter((s) => s.type === "PCS");
    this.wds = this.segments.filter((s) => s.type === "WDS");
    this.end = this.segments.filter((s) => s.type === "END");
  }

  static segmentByTypeGetter(
    type: string
  ): (this: DisplaySet) => BaseSegment[] {
    return function (this: DisplaySet) {
      return this.segments.filter((s) => s.type === type);
    };
  }
}

// Dynamically add segment type getters to DisplaySet
for (const type of Object.values(BaseSegment.SEGMENT)) {
  Object.defineProperty(DisplaySet.prototype, type.toLowerCase(), {
    get: DisplaySet.segmentByTypeGetter(type),
  });
}
