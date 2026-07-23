# HTML Elements Guide

This file explains common HTML elements and when to use them.

## 1. Basic structure

- `<!DOCTYPE html>`: tells the browser this is an HTML5 document.
- `<html>`: the root element of the page.
- `<head>`: contains metadata, title, CSS links, and scripts that should load before the page content.
- `<body>`: contains everything visible on the page.
- `<title>`: sets the browser tab title.

## 2. Page sections

- `<header>`: top section of a page or a section, usually for logos, titles, or navigation.
- `<nav>`: contains links for navigation, such as menus or page links.
- `<main>`: the main content of the page.
- `<section>`: groups related content together.
- `<article>`: independent content, such as a blog post or news item.
- `<aside>`: extra or related information, such as a sidebar.
- `<footer>`: bottom section of a page, often for contact info or copyright.

## 3. Generic containers

- `<div>`: a generic container used to group elements for layout or styling. Use it when no better semantic tag fits.
- `<span>`: inline version of `<div>`. Use it for styling or wrapping a small part of text inside a paragraph.

## 4. Text and content

- `<h1>` to `<h6>`: headings. Use `<h1>` for the main title, then smaller headings for sub-sections.
- `<p>`: paragraph of text.
- `<strong>`: important text, usually bold.
- `<em>`: emphasized text, usually italic.
- `<br>`: line break.
- `<hr>`: horizontal rule, used to separate sections.
- `<pre>`: preserves spaces and line breaks, often for code.
- `<blockquote>`: quoted text.

## 5. Links and media

- `<a>`: link to another page, file, or section. Use it for navigation and clickable content.
- `<img>`: image. Use `src` for the file path and `alt` for text if the image cannot load.
- `<video>`: embeds video content.
- `<audio>`: embeds audio content.

## 6. Lists

- `<ul>`: unordered list (bullets).
- `<ol>`: ordered list (numbered).
- `<li>`: one item in a list.
- `<dl>`: description list.
- `<dt>`: term in a description list.
- `<dd>`: description for a term.

## 7. Forms

- `<form>`: collects user input.
- `<input>`: one-line input field. Used for text, email, password, number, etc.
- `<label>`: describes an input field.
- `<textarea>`: multi-line text input.
- `<button>`: clickable button.
- `<select>` and `<option>`: dropdown menu.
- `<checkbox>` and `<radio>`: choice inputs.

## 8. Tables

- `<table>`: creates a table.
- `<tr>`: table row.
- `<th>`: header cell.
- `<td>`: regular table cell.

## 9. Attributes

Attributes provide extra information about an element.

- `class`: used to style or target multiple elements with the same name.
- `id`: used to identify one unique element.
- `href`: link destination for `<a>`.
- `src`: source file for images, videos, or scripts.
- `alt`: alternative text for images.
- `target`: controls where a link opens, such as a new tab.
- `title`: adds extra information shown as a tooltip.

## 10. When to use `class` vs `id`

- Use `class` when you want to apply the same style or behavior to many elements.
- Use `id` when you want to target one specific element.

## 11. Simple rule of thumb

- Use semantic tags when possible: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Use `<div>` only when you need a generic container.
- Use `<span>` for small inline content.
- Use `<a>` for links and `<button>` for actions.

## 12. Common beginner examples

- A page title: `<h1>Welcome</h1>`
- A navigation bar: `<nav><a href="#">Home</a></nav>`
- A list of items: `<ul><li>Soup</li><li>Salad</li></ul>`
- A paragraph: `<p>This is a paragraph.</p>`
- A container for styling: `<div class="box"></div>`
