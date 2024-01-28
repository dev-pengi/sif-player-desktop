const { dialog, } = window.require(
    "@electron/remote"
) as typeof import("@electron/remote");

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

const nativeDialog = async (message: string, options: DialogOptions = defaultOptions) => {
    const promise = new Promise<string>((resolve, reject) => {
        dialog.showMessageBox(
            {
                title: "Sif Player",
                message,
                ...options,
            }
        ).then((result) => {
            resolve(options?.buttons?.[result.response] ?? "");
        }).catch((err) => {
            reject(err);
        });
    });

    return promise;
}

