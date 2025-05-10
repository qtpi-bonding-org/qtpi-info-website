---
layout: page
title: "Blog"
permalink: /blog/
include_in_header: true
---

<h1>Blog Posts</h1>

<ul>
  {% assign sorted_posts = site.posts | sort: 'date' | reverse %}
  {% for post in sorted_posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> - {{ post.date | date: "%B %d, %Y" }}
      {% if post.categories %}
        <span> | Categories: {{ post.categories | join: ', ' }}</span>
      {% endif %}
      {% if post.tags %}
        <span> | Tags: {{ post.tags | join: ', ' }}</span>
      {% endif %}
    </li>
  {% endfor %}
</ul>
