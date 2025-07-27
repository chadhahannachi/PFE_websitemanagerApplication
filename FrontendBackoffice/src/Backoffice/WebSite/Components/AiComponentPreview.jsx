import React, { useEffect, useRef, useState } from 'react';

const AiComponentPreview = ({ content }) => {
  const iframeRef = useRef(null);
  const [localContent, setLocalContent] = useState(content);

  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  useEffect(() => {
    if (iframeRef.current && localContent && localContent.html_component && localContent.css_style) {
      const iframeDoc = iframeRef.current.contentDocument;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <style>
            body { margin: 0; }
            ${localContent.css_style}
            </style>
          </head>
          <body>
            ${localContent.html_component}
          </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, [localContent]);

  if (!localContent || (!localContent.html_component && !localContent.css_style)) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: '#888' }}>
        <h6>Aucun contenu généré pour le moment.</h6>
        <p>Générez un composant pour voir un aperçu.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ border: '1px solid #e0e0e0', backgroundColor: '#fff', borderRadius: 8 }}>
        <iframe
          ref={iframeRef}
          title="Aperçu du composant IA"
          style={{ width: '100%', border: 'none', minHeight: 200 }}
          onLoad={() => {
            if (iframeRef.current) {
              const iframe = iframeRef.current;
              try {
                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                if (doc && doc.body && doc.body.scrollHeight) {
                  iframe.style.height = (doc.body.scrollHeight + 8) + 'px';
                }
              } catch (e) {
                // ignore cross-origin errors
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default AiComponentPreview;