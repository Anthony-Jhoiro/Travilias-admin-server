import PostClass from "@tas/posts/models/PostClass";
import {GPSLocation, PostSchema} from "@tas/posts/types";
import ImageClass from "@tas/images/models/ImageClass";
import UserClass from "@tas/users/models/UserClass";

interface BuildPostOptions {
    makeId: () => string;
    findImageById: (id: string) => Promise<ImageClass>;
    findUserById: (id: string) => Promise<UserClass>;
}

export default function buildPost({makeId, findImageById, findUserById}: BuildPostOptions) {

    const isIdValid = (_v: string) => true;
    const isTitleValid = (_v: string) => true;
    const isContentValid = (_v: string) => true;
    const isAuthorIdValid = (_v: string) => true;
    const isLocationValid = (_v: GPSLocation) => true;
    const areImagesIdsValid = (_v: Array<string>) => true;
    const isCreatedAtValid = (_v: Date) => true

    return class Post extends PostClass {

        constructor({
                        id = makeId(),
                        imagesIds = [],
                        createdAt = new Date(),
                        ...options
                    }: PostSchema) {
            super({id, imagesIds, createdAt, ...options});

            if (!isIdValid(this._id)) {
                throw new Error("Invalid value for id")
            }
            if (!isTitleValid(this._title)) {
                throw new Error("Invalid value for title")
            }
            if (!isContentValid(this._content)) {
                throw new Error("Invalid value for content")
            }
            if (!isAuthorIdValid(this._authorId))  {
                throw new Error("Invalid value for author")
            }
            if (!isLocationValid(this._location)) {
                throw new Error("Invalid value for location")
            }
            if (!areImagesIdsValid(this._imagesIds)) {
                throw new Error("Invalid value for imagesIds")
            }
            if (!isCreatedAtValid(this._createdAt)) {
                throw new Error("Invalid value for createAt")
            }
        }

        async getAuthor(): Promise<UserClass> {
            if (!this._author) {
                this._author = await findUserById(this._authorId);
            }
            return this._author;
        }

        async getImages(): Promise<ImageClass[]> {
            return Promise.all(this._imagesIds.map(async image => await findImageById(image)));
        }

    }
}