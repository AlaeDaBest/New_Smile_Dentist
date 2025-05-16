import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: '984c1f808654acf1bb8f',    
    cluster: 'mt1',
    forceTLS: true
});

export default echo;
