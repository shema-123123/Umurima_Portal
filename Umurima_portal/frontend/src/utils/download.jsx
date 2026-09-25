import axios from 'axios';

export const downloadFile = async (url, token, filename) => {
  try {
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob',
    });

    const blob = new Blob([response.data], {
      type: response.headers['content-type'] || 'application/octet-stream',
    });

    const contentDisposition = response.headers['content-disposition'];
    let finalName = filename;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) finalName = match[1];
    }

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = finalName || `download_${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);

    return true;
  } catch (err) {
    console.error('Download error:', err);
    alert('Something went wrong while downloading the file. Please try again.');
    return false;
  }
};