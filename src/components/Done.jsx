import React, { useEffect, useState, useLayoutEffect } from 'react';
import Header from './Header';
import './Done.scss';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all'; // Import ScrollTrigger
import Footer from './Footer';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
gsap.registerPlugin(ScrollTrigger); // Register the ScrollTrigger plugin

export default function Done() {
  const [notification, setNotification] = useState(null);
  let socket = null;
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const name = localStorage.getItem('username');
    if (!name) {
      navigate('/login');
    }

    socket = io('https://restaurant-backend-5-ncc3.onrender.com', { transports: ['websocket'] });

    console.log('useEffect: setting up socket connection...');
    socket.on('connect', () => {
      console.log('Socket connected!');
      socket.emit('register', { username: localStorage.getItem('username') });

      console.log('done', socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected!');
    });

    socket.on('noti', ({ sender, receiver, chat, message }) => {
      console.log(`Received notification from ${sender} to ${receiver}: ${message}`);
      console.log(`Sender: ${sender}, Receiver: ${receiver}`);
      alert(`Received notification from ${sender} to ${receiver}: ${chat}`);
      setNotification({ sender, receiver, message });
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useLayoutEffect(() => {
    gsap.to('.page0', {
      opacity: 0,
      duration: 3,
      delay: 1
    });

    gsap.fromTo(
      '.page1 h1',
      {
        opacity: 0,
        y: 70,
      },
      {
        opacity: 1,
        y: 0,
        delay: 3,
        duration: 1
      }
    );

    gsap.to(".page2", {
      y: -200,
      opacity: 1,
      scrollTrigger: {
        trigger: ".page2",
        start: "top 80%",
        end: "top 20%",
        scrub: 2
      }
    });


    gsap.to("#img1",{
        x:100,
        duration:0.5,
        scrollTrigger:{
            trigger:"#img1",
            start:"top 80%",
            end:"top 20%",
            scrub:2
        }
    })
    gsap.to("#img3",{
      x:100,
      duration:0.5,
      scrollTrigger:{
          trigger:"#img3",
          start:"top 80%",
          end:"top 20%",
          scrub:2
      }
  })
    gsap.to("#img2",{
        x:-100,
        duration:0.5,
        scrollTrigger:{
            trigger:"#img2",
            start:"top 80%",
            end:"top 20%",
            scrub:2
        }
    })
    gsap.to("#img4",{
      x:-100,
      duration:0.5,
      scrollTrigger:{
          trigger:"#img4",
          start:"top 80%",
          end:"top 20%",
          scrub:2
      }
  })

  }, []);

  return (
    <>
      <Header/> {/* This should re-render now */}
      <div className='page0'>
        <h2>Welcome to the world's best Restaurant!!!</h2>
      </div>
      <div className='page1'>

        
        <h1>UrbanGrove<br />Eatery</h1>
      </div>
      <div className='page2'>
        <img id='main-img'  src='https://www.phocafe.co.uk/wp-content/uploads/2018/07/Menu-Background.jpg' alt='menu' />

        <div className='page2-content'>
            <img id='img1' src='https://www.phocafe.co.uk/wp-content/uploads/2023/12/Screenshot-2023-12-27-at-15.16.33-800x800.png'/>

            <h2>Good For you!!</h2>

            <img id='img2' src='https://www.phocafe.co.uk/wp-content/uploads/2023/05/Screenshot-2022-09-28-at-08.58.17.jpg'/>
            
            <h2 id='text2'>College friends relishing delightful moments over a feast.</h2>

            <img id='img3' src='https://www.phocafe.co.uk/wp-content/uploads/2023/05/Screenshot-2022-09-28-at-08.58.17.jpg'/>

<h2 id="t2">Good For you!!</h2>
<img id='img4' src='https://www.phocafe.co.uk/wp-content/uploads/2023/12/Screenshot-2023-12-27-at-15.16.33-800x800.png'/>

<h2 id='t3'>Healthy For you!!</h2>



        </div>
        <Footer/>
      </div>
      
    </>
  );
}
