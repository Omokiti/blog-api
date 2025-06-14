



// const calculateReadingTime = (post) => {
 
//   const wordCount = post.split(' ').length
  
//   const countPerMinute = wordCount / 200
//   const readingTime = Math.ceil(countPerMinute)
//   return ` ${readingTime} Minute Read Time`  
// }


const calculateReadingTime = (post) => {
    
    const wordCount = post.split(' ').length
    const averageReadingSpeed = 200
    const countPerMinute = wordCount /  averageReadingSpeed
    const readingTime = Math.ceil(countPerMinute)
    return ` ${readingTime} Minute Read Time`  
}


   

   module.exports={
 calculateReadingTime
   }



   