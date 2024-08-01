module.exports = (url, alt = "Missing alt text") => {
  return `
    <picture class="lazy">
      <source srcset="${url}" type="image/jpeg" sizes="(min-width: 1200px) 1200px, (min-width: 900px) 900px, (min-width: 600px) 600px, 400px" />
      <img src="${url}" alt="${alt}" />
    </picture>
  `;
};