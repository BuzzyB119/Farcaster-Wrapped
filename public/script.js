// Initialize Farcaster SDK
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check if running in Warpcast
    const isInWarpcast = window.location.href.includes('warpcast.com') || 
                        window.parent !== window;
    
    if (!isInWarpcast) {
      document.getElementById('results').innerHTML = '<p class="error">This app only works when opened through Warpcast. Please share the deployed URL in Warpcast to view your stats.</p>';
      return;
    }

    const response = await fetch('https://api.warpcast.com/v2/me', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Please connect your Farcaster account');
    }
    
    const user = await response.json();
    const fid = user.result.user.fid;
    
    // Fetch user stats
    const statsResponse = await fetch(`https://api.warpcast.com/v2/user-stats?fid=${fid}`, {
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!statsResponse.ok) throw new Error('Failed to fetch stats');
    const data = await statsResponse.json();
    
    // Update UI
    document.getElementById('total-casts').textContent = data.result.totalCasts || 0;
    document.getElementById('total-followers').textContent = data.result.followerCount || 0;
    
  } catch (error) {
    console.error('Error:', error);
    document.getElementById('results').innerHTML = `<p class="error">${error.message}</p>`;
  }
});
