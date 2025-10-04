import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForumPost } from '../../../shared/models/forum-post';
import { ForumService } from '../../../core/services/forum.service';
import {RouterLink} from '@angular/router';
import {BreadcrumbService} from '../../../core/services/breadcrumb.service';

@Component({
  selector: 'app-forum-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './forum-page.html',
  styleUrls: ['./forum-page.scss'],
})
export class ForumPageComponent implements OnInit {
  posts: ForumPost[] = [];
  isLoading = true;
  newPost = { title: '', content: '' };

  constructor(
    private forumService: ForumService,
    private breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit(): void {
    this.loadPosts();
    this.setupBreadcrumbs();
  }

  private setupBreadcrumbs(): void {
    setTimeout(() => {
      this.breadcrumbService.setBreadcrumbs([
        { label: 'Forum', url: '' }
      ]);
    });
  }

  loadPosts(): void {
    this.isLoading = true;
    this.forumService.getPosts().subscribe({
      next: (posts) => {
        // Sort posts to show the newest first
        this.posts = posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching posts:', err);
        this.isLoading = false;
      }
    });
  }

  onSubmitPost(): void {
    if (!this.newPost.title.trim() || !this.newPost.content.trim()) {
      alert('Please provide both a title and content for your post.');
      return;
    }
    this.forumService.createPost(this.newPost).subscribe({
      next: () => {
        this.newPost = { title: '', content: '' }; // Clear the form
        this.loadPosts(); // Refresh the list with the new post
      },
      error: (err) => {
        console.error('Error creating post:', err);
        alert('Failed to create post. Please try again.');
      }
    });
  }
}
