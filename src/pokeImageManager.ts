import { Bitmap, Utils } from "rmmz";

export default class PokeImageManager {

    static _emptyBitmap = new Bitmap(1, 1);

    static _cache: Map<string, Bitmap> = new Map();

    static getBitmap(folder: string, filename: string) {
        if (filename) {
            const url = folder + Utils.encodeURI(filename) + ".png";
            return this.getBitmapFromUrl(url);
        } else {
            return this._emptyBitmap;
        }
    }
    
    static getBitmapFromUrl (url: string): Bitmap {
        if (this._cache.has(url)) {
            return this._cache.get(url) as Bitmap; // Weve checked it exists
        }
        const bitmap = Bitmap.load(url);
        this._cache.set(url, bitmap);
        return bitmap;
    }

    static getPokemonBattler(id: string, type: "front"): Bitmap {
        return this.getBitmap(`img/pmz/pokemon/${type}/`, id.toUpperCase());
    }
}