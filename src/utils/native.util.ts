import { electron } from "./node.util";

const { dialog } = electron;

type DialogOptions = {
    type?: "error" | "none" | "info" | "question" | "warning";
    buttons?: string[];
    detail?: string;
}

const defaultOptions: DialogOptions = {
    type: "info",
    buttons: [],
    detail: "",
}

type Response = {
    code: number;
    text: string;
}

const nativeDialog = async (message: string, options: DialogOptions = defaultOptions): Promise<Response> => {
    const promise = new Promise<Response>((resolve, reject) => {
        dialog.showMessageBox(
            {
                title: "Sif Player",
                message,
                noLink: true,
                ...options,
            }
        ).then((result) => {
            const response = {
                code: result.response,
                text: options?.buttons?.[result.response] ?? "",
            }
            resolve(response);
        }).catch((err) => {
            reject(err);
        });
    });

    return promise;
}

const closeApp = (closeToTray: boolean = false) => {
    const window = electron.getCurrentWindow();
    if (closeToTray) {
        window.hide();
    } else {
        electron.app.quit();
    }
}

const minimizeApp = () => {
    electron.getCurrentWindow().minimize();
}

const maximizeApp = () => {
    const window = electron.getCurrentWindow();
    if (window.isMaximized()) {
        window.unmaximize();
    } else {
        window.maximize();
    }
}


export { nativeDialog, closeApp, minimizeApp, maximizeApp };