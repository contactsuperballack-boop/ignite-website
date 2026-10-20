/* Points the shared arm bar at subdomains when ROOT_DOMAIN is set on the page. */
(function(){var r=window.ROOT_DOMAIN;if(!r)return;document.querySelectorAll(".armbar a[data-k]").forEach(function(a){var k=a.dataset.k;a.href=k==="about"?"https://"+r+"/#about":"https://"+(k==="home"?"":k+".")+r;});})();
