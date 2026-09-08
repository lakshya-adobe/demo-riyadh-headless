/*
Copyright 2022 Adobe
All Rights Reserved.

NOTICE: Adobe permits you to use, modify, and distribute this file in
accordance with the terms of the Adobe license agreement accompanying
it.
*/
import React from "react";
import "../scripts/aem-embed"; // registers the <aem-embed> custom element
import "./EdsBlock.scss";

/**
 * Strip a trailing ".plain.html" or ".html" from an EDS page URL. The
 * <aem-embed> element appends ".plain.html" itself, so callers may pass either
 * the page URL or its plain variant without producing a doubled extension.
 */
function toEmbedUrl(url) {
    return url.replace(/(\.plain)?\.html$/i, "");
}

/**
 * Embeds an AEM Edge Delivery Services block (e.g. "hero-lab") into the React
 * app through the <aem-embed> web component. The block renders inside the
 * element's shadow DOM, so EDS styles stay isolated from the app's styles.
 *
 * @param {string} url        EDS page URL that contains the block
 * @param {string} [type]     "main" (default), "header", or "footer"
 * @param {string} [className] Extra class names for the wrapper
 */
function EdsBlock({ url, type = "main", className = "" }) {
    return (
        <div className={`eds-block ${className}`.trim()}>
            {/*
              key forces a fresh element when the URL changes: <aem-embed>
              fetches only once (guarded by `initialized`) and never re-renders
              itself in place. url must be present at mount because the
              component's connectedCallback reads it immediately.
            */}
            <aem-embed key={url} url={toEmbedUrl(url)} type={type} />
        </div>
    );
}

export default EdsBlock;
