/* Revalidate updated content when available; reuse cached bytes otherwise. */
window.HPCMM_CONTENT_READY = fetch('content.js', {cache: 'no-cache'})
  .then(response => {
    if (!response.ok) throw Error('Content could not be loaded.');
    return response.text();
  })
  .then(text => {
    const marker = 'window.HPCMM_CONTENT = ';
    const start = text.indexOf(marker);
    if (start < 0) throw Error('Invalid content file.');
    window.HPCMM_CONTENT = JSON.parse(text.slice(start + marker.length).trim().replace(/;\s*$/, ''));
  })
  .catch(() => {
    const target = document.getElementById('status') || document.querySelector('main');
    if (target) target.textContent = 'The website content could not be loaded. Please refresh to try again.';
  });
