function extractUUIDFromBlobUrl(blobUrl: string): string | null {
  const regex = /blob:http(s)?:\/\/[^/]+\/([a-fA-F0-9-]+)/;
  const match = blobUrl.match(regex);
  return match ? match[2] : null;
}

export {extractUUIDFromBlobUrl};