import { fs, path } from ".";
import { formats } from "../constants";
import { Dir, SortType } from "../types";

const getDirInformation = async (
    dirPath: string
): Promise<Dir> => {
    const dirName = path.basename(dirPath);
    const parentDir = path.dirname(dirPath);
    if (dirName.startsWith(".")) throw new Error('hidden dir');

    let file: any = {};
    const dirStat = await fs.promises.stat(dirPath);

    let isDirectory = dirStat.isDirectory();


    if (isDirectory) {
        const nestedDirents = await fs.promises.readdir(dirPath, {
            withFileTypes: true,
        });
        const videos = nestedDirents
            ?.filter((nestedDir) => {
                const ext = path.extname(nestedDir.name).slice(1);
                return (
                    !nestedDir.isDirectory() &&
                    !nestedDir.name.startsWith(".") &&
                    formats.includes(ext)
                );
            })
            .map((nestedDir) => {
                const nestedDirPath = path.resolve(dirPath, nestedDir.name);
                return nestedDirPath;
            })

        const nestedDirs = nestedDirents
            ?.filter((nestedDir) => {
                return (
                    nestedDir.isDirectory() && !nestedDir.name.startsWith(".")
                );
            })
            .map((nestedDir) => {
                const nestedDirPath = path.resolve(dirPath, nestedDir.name);
                return nestedDirPath;
            })

        file = {
            name: dirName,
            dir: true,
            path: dirPath,
            parent: parentDir,
            creationDate: dirStat.birthtimeMs,
            searchValid: false,
            videos,
            nestedDirs,
        };
    } else {
        const ext = path.extname(dirName).slice(1);
        if (formats.includes(ext)) {
            file = ({
                name: dirName,
                dir: false,
                type: ext,
                path: dirPath,
                parent: parentDir,
                creationDate: dirStat.birthtimeMs,
                searchValid: false,
            });
        }
    }
    if (!file?.name) throw new Error('invalid')
    return file
}

const extractVideos = (dirs: any[], extractPath = false, isSearching = false) => {
    const filteredVideo = dirs.filter(dir => {
        return !dir.dir
    })

    let videos = filteredVideo.filter(video => {
        return !isSearching || (isSearching && video.searchValid)
    });

    if (extractPath) videos = videos.map(video => video.path);

    return videos;
}

const sortFiles = (files: Dir[], sortType: SortType = 'newest', foldersFirst = true) => {
    const sortedFiles = files.sort((a, b) => {
        if (a.dir && !b.dir) return foldersFirst ? -1 : 1
        if (!a.dir && b.dir) return foldersFirst ? 1 : -1
        if (sortType === 'newest') {return b.creationDate - a.creationDate}
        if (sortType === 'oldest') return a.creationDate - b.creationDate
        if (sortType === 'name') return a.name.localeCompare(b.name)
        if (sortType === 'size') return 0
        
    })

    return sortedFiles;
}


export {
    getDirInformation, extractVideos, sortFiles
}