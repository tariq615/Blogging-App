import conf from '../conf/conf.js'
import { Client, ID, Databases, Storage, Query} from 'appwrite';


export class Service{
     client = new Client();
     databases;
     bucket;

     constructor(){
        this.client
        .setEndpoint(conf.appwriteUrl)
        .setProject(conf.appwriteProjectId)

        this.databases = new Databases(this.client)
        this.bucket = new Storage(this.client)
     }

     async createPost({title, slug, content, featuredimage, status,  userid}){
        try {
            return await this.databases.createDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status,
                    userid
                }
            )            
        } catch (error) {
            console.log("Appwrite serive :: createPost :: error", error);
        }
     }

     async updatePost(slug, {title, content, featuredimage, status}){
        try {
            return await this.databases.updateDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug,
                {
                    title,
                    content,
                    featuredimage,
                    status
                }
            )
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
     }

     async deletePost(slug){
        try {
            await this.databases.deleteDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            )
            return true
        } catch (error) {
            console.log('Appwrite srive :: deletepost :: error' , error)
            return false
        }
     }

     async getPost(slug){
        try {
            return await this.databases.getDocument(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                slug
            ) 
        } catch (error) {
            console.log('Appwrite srive :: getPost :: error' , error)
            return false
        }
     }

     async getPosts(queries = [Query.equal("status","active")]){
        try {
            return await this.databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId,
                queries
            )
        } catch (error) {
            console.log('Appwrite srive :: getPosts :: error' , error)
            return false
        }
     }

     //file upload service

     async uploadFile(file){           // createfile
        try {
            return await this.bucket.createFile(
                conf.appwriteBucketId,
                ID.unique(),
                file
            )
        } catch (error) {
            console.log('Appwrite srive :: uploadFile :: error' , error)
            return false
        }
     }

     async deleteFile(fileId){
        try {
         await this.bucket.deleteFile(
            conf.appwriteBucketId,
            fileId
        )
        return true
        } catch (error) {
            console.log('Appwrite srive :: deleteFile :: error' , error)
            return false
        }
    }

     getFilePreview(fileId){
        return this.bucket.getFilePreview(
            conf.appwriteBucketId,
            fileId
        )
     } 
}

const service = new Service()

export default service