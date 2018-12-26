import { LoadingManager, EventDispatcher, Material, MaterialCreator } from "three";


declare class MTLLoader extends EventDispatcher {
    constructor(manager?: LoadingManager);
    manager: LoadingManager;
    materialOptions: {};
    materials: Material[];
    path: string;
    texturePath: string;
    crossOrigin: boolean;

    load(url: string, onLoad: (materialCreator: MaterialCreator) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
    parse(text: string) : MaterialCreator;
    setPath(path: string) : void;
    setTexturePath(path: string) : void;
    setBaseUrl(path: string) : void;
    setCrossOrigin(value: boolean) : void;
    setMaterialOptions(value: any) : void;
}