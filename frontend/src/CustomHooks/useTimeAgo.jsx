import {useState,useEffect} from 'react'

function useTimeAgo(timestamp) {
    const [timeAgo, setTimeAgo] = useState('');
    if(!timestamp){
        return null
    }

    useEffect(() => {
      const calculateTimeAgo = () => {
        const currentTime = new Date();
        const createdAt = new Date(timestamp);
        const timeDifference = currentTime - createdAt;
  
        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const month = Math.floor(days/28)
        const year = Math.floor(month/12)
  
        let timeString = '';
        if(year>0){
            if(year==1){
                timeString = `${year} year ago`;
            }
            else timeString = `${year} years ago`;
        }
        else if(month>0){
         if(month==1) timeString = `${month} month ago`;
         else timeString = `${month} months ago`

        }
        else if (days > 0) {
          if(days==1)timeString = `${days} day ago`;
          else timeString = `${days} days ago`;
        } else if (hours > 0) {
          if (hours==1) timeString = `${hours} hour ago`;
          else timeString = `${hours} hours ago`;
        } else if (minutes > 0) {
          if(minutes==1) timeString = `${minutes} minute ago`;
          else timeString = `${minutes} minutes ago`;
        } else {
          timeString = `${seconds} seconds ago`;
        }
  
        setTimeAgo(timeString);
      };
  
      // Calculate time initially
      calculateTimeAgo();
  
    //   // Set up interval to update the time ago every minute
    //   const interval = setInterval(calculateTimeAgo, 60000);
  
    //   // Cleanup the interval on unmount
    //   return () => clearInterval(interval);
    }, [timestamp]); // Re-run the effect if the timestamp changes
  
    return timeAgo;
}

export default useTimeAgo