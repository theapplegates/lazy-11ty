---
title: Roll your own lazy loading
layout: default
---
<nav>
  <ul>
    <li><a href="/about">About</a></li>
    <li><a href="/page1">Page1</a></li>
    <li><a href="/page2">Page2</a></li>
    <li><a href="/page3">Page3</a></li>
  </ul>
</nav>

<section class="blog-posts">
  {% for post in collections.post %}
    <article>
      <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
      <p>{{ post.data.date }}</p>
      <p>{{ post.data.excerpt }}</p>
    </article>
  {% endfor %}
</section>

{% for post in collections.post %}
  <article>
    <h2><a href="{{ post.url }}">{{ post.data.title }}</a></h2>
    <p>{{ post.data.date }}</p>
    <p>{{ post.data.excerpt }}</p>
    {% if post.data.image %}
      {{ picture(post.data.image, post.data.alt) }}
    {% endif %}
  </article>
{% endfor %}

Take a look at [the code on GitHub]({{ pkg.repository.url }}), or read on, for more explanation and examples.

{% set somePhotos = [
  {url: "k-mitch-hodge.jpg", credit: "K. Mitch Hodge", creditURL: "https://unsplash.com/photos/white-sailboat-on-sea-near-green-mountain-under-white-clouds-during-daytime-0IJ_sheMlDo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"},
  {url: "mitch-botsford.jpg", credit: "Mitch Botsford", creditURL: ""},
  {url: "348668.jpg", credit: "Emilio Garcia", creditURL: "https://unsplash.com/photos/an-aerial-view-of-a-sandy-beach-and-ocean-Jk733Hfu_To?utm_source=your_app_name&utm_medium=referral"},
  {url: "293927.jpg", credit: "Narissa de Villiers", creditURL: "https://unsplash.com/photos/a-close-up-of-two-people-holding-hands-WmtpJcAPMco?utm\_source=your\_app\_name&utm\_medium=referral"},
  {url: "384844.jpg", credit: "Juan Domenech", creditURL: "https://unsplash.com/photos/a-building-with-balconies-and-balconies-on-the-top-of-it-QYLJsjWIZsE?utm\_source=your\_app\_name&utm\_medium=referral"},
  {url: "502680.jpg", credit: "Clay Banks", creditURL: "https://unsplash.com/photos/a-kitchen-counter-with-a-coffee-maker-and-cups-on-it-nLXxZSK1TLw?utm\_source=your\_app\_name&utm\_medium=referral"},
  {url: "264839.jpg", credit: "Dana Mortz", creditURL: "https://unsplash.com/photos/a-river-running-through-a-city-next-to-tall-buildings-N\_JAVazMvtk?utm\_source=your\_app\_name&utm\_medium=referral"}
] %}

<section class="post-teaser">
 {%- for photo in somePhotos %}
   <div class="credit">By <a href="{{ photo.creditURL }}" target="_BLANK" rel="noopener"> {{ photo.credit }}</a>, (<a href="/images/original/{{ photo.url }}" target="_BLANK" rel="noopener">Original</a>)</div>
   {% lazypicture photo.url, "Lazy loading brought to you by the talented  Unsplash photographers  " %}
 {%- endfor -%}
 </section >
 
## Image transformation

Thanks to the [Netlify Image CDN](https://docs.netlify.com/image-cdn/overview/?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex), we can take advantage of the ability to perform on-the-fly [image transformations](https://docs.netlify.com/image-cdn/overview/?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex#transform-images) to deliver resized and cropped, versions of the images, in the best format for the user's browser, directly from Netlify's optimised [edge infrastructure](https://www.netlify.com/features/adn/?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex).

Netlify Image CDN transforms and caches image assets if you make requests via a special `/.netlify/images/` URL, and add querystring parameters.

For example, the image below can be served in any size:

- [/.netlify/images/?url=/images/lighthouse-5.jpg?&w=20](/.netlify/images/?url=/images/lighthouse-5.jpg&w=20)
- [/.netlify/images/?url=/images/lighthouse-5.jpg&w=500](/.netlify/images/?url=/images/lighthouse-5.jpg&w=500)
- [/.netlify/images/?url=/images/lighthouse-5.jpg&w=700](/.netlify/images/?url=/images/lighthouse-5.jpg&w=700)

## Abstract with helper URLs

To clean these URLs up a little, we can use [Netlify's Redirects API](https://www.netlify.com/docs/redirects/?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex) to create some more friendly and abstracted URLs which [proxy]({{ pkg.repository.url }}/blob/master/netlify.toml) to the querystring decorated URLs:

- [/images/tiny/lighthouse-5.jpg](/images/tiny/lighthouse-5.jpg) → [/.netlify/images/?url=/images/lighthouse-5.jpg&w=20](/.netlify/images/?url=/images/lighthouse-5.jpg&w=20) 
- [/images/small/lighthouse-5.jpg](/images/small/lighthouse-5.jpg) → [/.netlify/images/?url=/images/lighthouse-5.jpg&w=500](/.netlify/images/?url=/images/lighthouse-5.jpg&w=500) 
- [/images/original/lighthouse-5.jpg](/images/original/lighthouse-5.jpg) → [/images/lighthouse-5.jpg](/images/lighthouse-5.jpg)

The [redirects]({{ pkg.repository.url }}/blob/master/netlify.toml) and transformations even work locally to ease your development efforts if you run your local build with [Netlify Dev](https://netlify.com/products/dev?utm_source=github&utm_medium=icdn-example-pnh&utm_campaign=devex)

## Using the picture element

These images have been added to the page in various sizes, using the picture element with multiple image sources.


{% set somePhotos = [
  {url: "lighthouse-5.jpg", credit: "ezgi yıldırım", creditURL: "https://unsplash.com/photos/Ej1mWW2cd6Q"}
] %}
<section class="post-teaser">
{%- for photo in somePhotos %}
  <div class="credit">By <a href="{{ photo.creditURL }}" target="_BLANK" rel="noopener"> {{ photo.credit }}</a>, (<a href="/images/original/{{ photo.url }}" target="_BLANK" rel="noopener">Original</a>)</div>
  {% lazypicture photo.url, "A snazzy lighthouse" %}
{%- endfor -%}
</section >

## A picture helper

Whatever tool you use to generate your HTML, chances are that it includes a facility to make shortcodes or macros.

This example uses a static site generator called [11ty](https://www.11ty.io) which gives us the ability to make a [shortcode](https://www.11ty.io/docs/shortcodes/) to output picture tags with many image source attributes including  transformation parameters automatically added to the image urls.

This shortcode:

```html
{%- raw -%}
{% lazypicture lighthouse.jpg "A snazzy lighthouse" %}
{% endraw %}
```

outputs this html:

```html
<picture class="lazy lazy-initial">
  <source srcset="/images/tiny/lighthouse.jpg" media="(min-width: 1200px)">
  <source srcset="/images/tiny/lighthouse.jpg" media="(min-width: 740px)">
  <img src="/images/tiny/lighthouse.jpg" alt="A snazzy lighthouse" />
</picture>
```

This sets _each image source_ to use a tiny (typically less that 1k) version of the image. With some CSS, we size the image to fit and add some blurring to smooth it all down nicely.

Then, thanks to the magic of the browser's [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API). We can detect when our images come into the viewport, and [use JavaScript to update our image sources]({{ pkg.repository.url }}/blob/master/src/js/lazy.js) to use more appropriately sized images in our responsive picture element.

Removing the CSS class which applies the blur once our new image source is loaded completes the effect.

## Get started with Netlify Image CDN

Need some reference code to get you going? You can clone [the code for this site]({{ pkg.repository.url }}) to use as an example.

Once cloned, you can run the build locally or push to Netlify and start getting the benefits of the Netlify Image CDN right away.
