const Blog= require('../models/blogs')

const{calculateReadingTime} = require('../readingtime')




const createPost = async(req,res)=>{

    const {title,body,description,tags} =req.body
    const tagsArray = req.body.tags
  ? req.body.tags.split(',').map(tag => tag.trim())
  : [];

    try{
        const post= await Blog.create({
            title,
            body,
            description,
            author:req.user._id,
            tags:tagsArray,
            reading_time:calculateReadingTime(body)
        })
        
        return res.redirect('/userposts');
   
    } catch(error){
      console.log(error)
      res.status(500).json({ error: error.message });
    }
}


//all blog posts no authentication

const getAllPosts=async(req,res)=>{
    
    try{

        const {
            author,
            title,
            tags,
            page = 1,
            limit = 20,
            order_by = 'timestamp', 
            order = 'asc',
              
          } = req.query;
          const query = {};
    
        if (author) {
          query.author = { $regex: author, $options: 'i' };
        }
    
        if (title) {
          query.title = { $regex: title, $options: 'i' };
        }
    
        if (tags) {
          const tagArray = tags.split(',').map(tag => tag.trim());
          query.tags = { $in: tagArray };
        }
    
        // Sort options
        const sortOptions = {};
        const validSortFields = ['read_count', 'reading_time', 'timestamp'];
        if (validSortFields.includes(order_by)) {
          sortOptions[order_by] = order === 'asc' ? 1 : -1;
        }
    
        const posts = await Blog.find(query)
        .populate('author','first_name last_name')
          .sort(sortOptions)
          .skip((page - 1) * limit)
          .limit(Number(limit));
    
        const totalCount = await Blog.countDocuments(query);
        
        res.render('posts', {
          posts,
          page: Number(page),
          per_page: Number(limit),
          total_blogs: totalCount
        });
        
    }
    
   catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message })
    
  }
}

//get one post

const getSinglePost=async(req,res)=>{
 const {id }= req.params
 try{
 const post = await Blog.findOne({_id:id, state:'published'}).populate(
  'author',
  'first_name last_name'
 )
 if(!post){
  return res.status(400).json({message:'Published blog not found'})
 }
 post.read_count+=1;
  await post.save();
  res.render('post',{ post });
  
 }catch(error){
  console.error(error);
  res.status(500).json({ error: error.message })
 }
}

//get users post 
const getUserPosts = async(req,res)=>{
 const{page=1,limit=10,state}= req.query

 const query={ author:req.user._id } 

 if(state){
  query.state=state
 }

 try{
  
 const posts = await Blog.find(query)
.sort({timestamp:-1})
.skip((page - 1) *limit)
.limit(Number(limit))
const totalCount = await Blog.countDocuments(query);

res.render('userposts', {
  posts,
  total_blogs: totalCount,
  page: Number(page),
  per_page: Number(limit),
  user: req.user
});

 }catch(error){
  console.error(error);
  res.status(500).json({ error: error.message });
 }

}

//renders edit post page
const editPost=async(req,res)=>{

  try{
    const post = await Blog.findById(req.params.id)
    if(!post|| post.author.toString() !== req.user._id.toString()){
      return res.status(403).send('Not authorized')
    }
    res.render('edit',{ post });
  }catch(error){
    res.status(500).json({ error: error.message })
    
  }
 

}
//update post after editing
const updatePost = async(req,res)=>{
  try{
    const{title,body,description,tags}=req.body
    const post = await Blog.findById(req.params.id)
     
    if(!post || post.author.toString() !== req.user._id.toString()){
      return res.status(403).send('Not authorized')

    }
     post.title = title,
     post.body = body,
     post.description = description,
     post.tags = tags.split(',').map(tag => tag.trim());
     post.reading_time= calculateReadingTime(body)

     await post.save();
     res.redirect('/userposts')

  }catch(error){
    res.status(500).json({ error: error.message })
  }
}

//update state
const updateState = async(req,res)=>{
  const postId = req.params.id
  try{
    const post = await Blog.findById({ _id:postId, author:req.user._id})

    if(!post){
      return res.status(404).json({message:'Post not found or authorized'})
    }
    post.state='published'
    await post.save();
    res.redirect('/userposts')
    
  } catch(error){
    console.log(error)
    res.status(500).json({error: error.message})
  }


}
//delete post
const deletePost = async(req,res)=>{
try{
  const post = await Blog.findById(req.params.id)
  if(!post || post.author.toString() !== req.user._id.toString()){
    return res.status(403).send('Not authorized')

  }
  await post.deleteOne()

  res.redirect('/userposts')
}catch(error){
  res.status(500).json({ error: error.message })
}
}

module.exports={
createPost,
getAllPosts,
getSinglePost,
getUserPosts,
editPost,
updatePost,
deletePost,
updateState
}

