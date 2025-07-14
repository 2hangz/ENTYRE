export default function BackgroundImageNode({ data }) {

  return (
    <div
      style={{
        width: '400px',
        height: '100px',
      }}
    >
      <img
        src={data.icon || data.src}
        style={{
          width: 
          data.id === 's1' ? '250px' : 
          data.id === 's2' ? '400px' : 
          data.id === 's3' ? '750px' : '400px',

          height:
          data.id === 's1' ? '135px' : 
          data.id === 's2' ? '150px' :
          data.id === 's3' ? '380px' : '100px',
          opacity: 1,
          objectFit: 'cover',
          pointerEvents: 'none'
        }}
        alt="bg"
      />
    </div>
  );
}