export const pathwayButtonStyle = (selected) => ({
    padding: '8px 20px',
    borderRadius: 20,
    border: 'none',
    background: selected ? '#05243B' : '#e5e7eb',
    color: selected ? '#fff' : '#05243B',
    fontWeight: 600,
    fontSize: 16,
    boxShadow: selected ? '0 2px 8px rgba(5,36,59,0.12)' : 'none',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });
  
  export const pathwayInfoCard = {
    marginBottom: 16,
    background: '#f8fafc',
    borderRadius: 8,
    padding: 16,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    width: '100%',
    maxWidth: '45%',
    textAlign: 'left'
  };
  
  export const flowContainer = {
    width: 'calc(100vw - 80px)',
    maxWidth: '100%',
    height: '50vh',
    background: '#f3f4f6',
    borderRadius: 8,
    margin: 10,
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  export const footer = {
    background: '#05243B',
    padding: 10,
    textAlign: 'center',
    color: '#fff',
  };