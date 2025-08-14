import React from 'react';

const CertificateButton = ({ userId, skillId }) => {
  const handleDownload = async () => {
    const response = await fetch(`http://localhost:8080/api/certificate/${userId}/${skillId}`);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'certificate.pdf';
    link.click();
  };

  return (
    <button className="btn btn-success mt-2" onClick={handleDownload}>
      🎓 Download Certificate
    </button>
  );
};

export default CertificateButton;