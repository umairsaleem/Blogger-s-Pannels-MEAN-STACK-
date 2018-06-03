import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { NgForm } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {
  title:string;
  body:string;
  comment;
  username;

  newPost = false;
  loadingBlogs = false;
  processing = false;
  messageClass;
  message;
  blogPosts;
  newComment = [];
  enabledComments = [];

  constructor( private authService: AuthService,
               private blogService: BlogService) { }

               ngOnInit() {
                // Get profile username on page load
                this.authService.getProfile().subscribe(profile => {
                  this.username = profile.user.username; // Used when creating new blog posts and comments
                });
                this.getAllBlogs();
              }

   // Function to display new blog form
   newBlogForm() {
    this.newPost = true; // Show new blog form
  }

  // Reload blogs on current page
  reloadBlogs() {
    this.loadingBlogs = true; // Used to lock button
    this.getAllBlogs();
    // Get All Blogs
    setTimeout(() => {
      this.loadingBlogs = false; // Release button lock after four seconds
    }, 4000);
  }

  onBlogSubmit(form : NgForm ) {
    this.processing = true; // Disable submit button
   // this.disableFormNewBlogForm(); // Lock form
    // Create blog object from form fields
    const blog = {
     title : this.title,
     body: this.body,
     createdBy: this.username


    }

    // Function to save blog into database
    this.blogService.newBlog(blog).subscribe(data => {
      // Check if blog was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
      ////  this.enableFormNewBlogForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        this.getAllBlogs();
        // Clear form data after two seconds
        setTimeout(() => {
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          form.reset(); // Reset all form fields
          //this.enableFormNewBlogForm(); // Enable the form fields
        }, 2000);
      }
    });
  }

  goBack() {
    window.location.reload(); // Clear all variable states
  }

  // Function to get all blogs from the database
  getAllBlogs() {
    // Function to GET all blogs from database
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs; // Assign array to use in HTML
    });
  }

  // Function to like a blog post
  likeBlog(id) {
    // Service to like a blog post
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs(); // Refresh blogs after like
    });
  }

// Function to disliked a blog post
  dislikeBlog(id) {
    // Service to dislike a blog post
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs(); // Refresh blogs after dislike
    });
  }

  // Function to post a new comment on blog post
  draftComment(id) {
   // this.form.reset(); // Reset the comment form each time users starts a new comment
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id); // Add the post that is being commented on to the array
  }

  // Function to cancel new post transaction
  cancelSubmission(id) {
    const index = this.newComment.indexOf(id); // Check the index of the blog post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    //this.commentForm.reset(); // Reset  the form after cancellation
    
    this.processing = false; // Enable any buttons that were locked
  }

  // Function to post a new comment
  postComment(id) {
   // this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
   // const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.blogService.postComment(id, this.comment).subscribe(data => {
      this.getAllBlogs(); // Refresh all blogs to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the blog id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      //this.enableCommentForm(); // Re-enable the form
     // this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });
  }

  // Expand the list of comments
  expand(id) {
    this.enabledComments.push(id); // Add the current blog post id to array
  }

  // Collapse the list of comments
  collapse(id) {
    const index = this.enabledComments.indexOf(id); // Get position of id in array
    this.enabledComments.splice(index, 1); // Remove id from array
  }

}
