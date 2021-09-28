
import mongoose from 'mongoose';
import PostMessage from "../models/postMessage.js";
import Crypto from "crypto-js";
import dotenv from 'dotenv';
import UserModal from "../models/user.js";

export const getPosts=async (req,res)=>{
    try{
        
        const key=process.env.SECRET;
        const postMessages=await PostMessage.find();

        //res.status(200).json(postMessages);

        console.log(postMessages);
        try{
    
        for(var i=0;i<postMessages.length;i++){
        const message_bytes = Crypto.AES.decrypt(postMessages[i].message, key);
        const message_decrypted = message_bytes.toString(Crypto.enc.Utf8);
        postMessages[i].message=message_decrypted


        const title_bytes = Crypto.AES.decrypt(postMessages[i].title, key);
        const title_decrypted = title_bytes.toString(Crypto.enc.Utf8);
        postMessages[i].title=title_decrypted
        }
        
        res.status(200).json(postMessages);
        }
        catch(error){
            res.status(200).json(postMessages);
        }
    }
    catch(error){
        res.status(404).json({message:error.message});
    }
}

export const createPost=async (req,res)=>{
    const post=req.body;
    console.log(req.userId)
    const newPostMessage=new PostMessage({...post,creator: req.userId,createdAt:new Date().toISOString()})
    const oldUser = await UserModal.findById(req.userId);
    console.log(oldUser)
    const key=process.env.SECRET;
    newPostMessage.title = Crypto.AES.encrypt(newPostMessage.title, key).toString();
    newPostMessage.message = Crypto.AES.encrypt(newPostMessage.message, key).toString();
    try{
        await newPostMessage.save();
        const message_bytes = Crypto.AES.decrypt(newPostMessage.message, key);
        const message_decrypted = message_bytes.toString(Crypto.enc.Utf8);
        newPostMessage.message=message_decrypted


        const title_bytes = Crypto.AES.decrypt(newPostMessage.title, key);
        const title_decrypted = title_bytes.toString(Crypto.enc.Utf8);
        newPostMessage.title=title_decrypted

        console.log(newPostMessage)
        res.status(201).json(newPostMessage);
    }
    catch(error){
        res.status(409).json({message:error.message});
    }
}

export const updatePost=async (req,res)=>{

    const {id:_id}=req.params;
    
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    
    const post=req.body;
    const key=process.env.SECRET;
    
    post.title = Crypto.AES.encrypt(post.title, key).toString();
    post.message = Crypto.AES.encrypt(post.message, key).toString();
    
    console.log(post);
    
    const updatedPost=await PostMessage.findByIdAndUpdate(_id,{...post,_id},{new: true});
    
    const message_bytes = Crypto.AES.decrypt(updatedPost.message, key);
    const message_decrypted = message_bytes.toString(Crypto.enc.Utf8);
    updatedPost.message=message_decrypted

    const title_bytes = Crypto.AES.decrypt(updatedPost.title, key);
    const title_decrypted = title_bytes.toString(Crypto.enc.Utf8);
    updatedPost.title=title_decrypted
    
    res.json(updatedPost);
}

export const deletePost=async (req,res)=>{
    const {id:_id}=req.params;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    await PostMessage.findByIdAndRemove(_id);
    console.log('Deleted');
    res.json({message:'Post deleted successfully'});
}

export const likePost=async (req,res)=>{
    const {id:_id}=req.params;
    if(!req.userId) return res.json({message:'Not Authorized'});
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');
    const post=await PostMessage.findById(_id);
    const index=post.likes.findIndex((id)=>id===String(req.userId))
    if(index===-1){
        post.likes.push(req.userId);
    }
    else{
        post.likes=post.likes.filter((id)=>id!=String(req.userId));
    }
    const updatedPost=await PostMessage.findByIdAndUpdate(_id,post,{new:true});
    res.json(updatedPost);
}