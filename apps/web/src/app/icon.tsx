import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#0D2137',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
        }}
      >
        <div style={{ display: 'flex', position: 'relative' }}>
          {/* We'll use a simpler representation for the favicon: just an orange and skyblue split, since complex masks are hard in ImageResponse */}
          <div style={{ width: 12, height: 20, background: '#E8532A', borderTopLeftRadius: 4, borderBottomLeftRadius: 4 }} />
          <div style={{ width: 2 }} /> {/* Lightning bolt gap */}
          <div style={{ width: 12, height: 20, background: '#2F6B9A', borderTopRightRadius: 4, borderBottomRightRadius: 4 }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
