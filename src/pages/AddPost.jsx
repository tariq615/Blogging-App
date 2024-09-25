import React from 'react'
import { Container, PostForm } from '../components'
function AddPost() {
  return (
      /*creating the new post thats why not sending the prop in postForm*/
    <div className='py-8'>
    <Container>
      <PostForm /> 
    </Container>
    </div>
  )
}

export default AddPost