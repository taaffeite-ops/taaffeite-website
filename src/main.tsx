import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { injectSpeedInsights } from '@vercel/speed-insights'

injectSpeedInsights()

// Temporary PerformanceObserver for debugging layout shifts (CLS)
try {
  let clsValue = 0;
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const e = entry as any;
      if (!e.hadRecentInput) {
        clsValue += e.value;
        const shiftDetails = {
          entryValue: e.value,
          cumulativeScore: clsValue,
          sources: e.sources ? e.sources.map((s: any) => {
            const el = s.node as HTMLElement;
            return {
              tagName: el ? el.tagName : 'unknown',
              className: el ? el.className : (s.node ? s.node.nodeName : ''),
              id: el ? el.id : '',
              previousRect: s.previousRect ? {
                top: s.previousRect.top,
                bottom: s.previousRect.bottom,
                left: s.previousRect.left,
                right: s.previousRect.right,
                width: s.previousRect.width,
                height: s.previousRect.height
              } : null,
              currentRect: s.currentRect ? {
                top: s.currentRect.top,
                bottom: s.currentRect.bottom,
                left: s.currentRect.left,
                right: s.currentRect.right,
                width: s.currentRect.width,
                height: s.currentRect.height
              } : null
            };
          }) : []
        };
        console.warn('CLS_REPORT_START\n' + JSON.stringify(shiftDetails, null, 2) + '\nCLS_REPORT_END');
      }
    }
  });
  observer.observe({ type: 'layout-shift', buffered: true });
} catch (e) {
  console.error('CLS observer not supported or failed', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

