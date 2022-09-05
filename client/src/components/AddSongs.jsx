import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { FaUserAlt } from 'react-icons/fa'
import { IoEarth } from 'react-icons/io5';
import { MdOutlineCancel } from 'react-icons/md'
import Select from 'react-select';
import { VscNewFile } from 'react-icons/vsc';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '../firebase.config';
import { useStateValue } from '../context/StateProvider';
import { saveNewSong } from '../api';
import { actionType } from '../context/reducer';

const AddSongs = ({setIsOpen}) => {
    const [images,setImages ] = useState([]);
    const [title, setTitle ] = useState("");
    const [duration, setDuration] = useState();
    const [progress, setProgress] = useState(0);
    const [date,setDate] = useState();
    const [optionsArtist, setOptionsArtist] = useState([]);
    const [optionsGenre, setOptionsGenre] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedOptionGenre, setSelectedOptionGenre] = useState(null);

    const [ {user} ,dispatch] = useStateValue();

    const handleChange = (e) => {
      for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
        setImages((prevState) => [...prevState, newImage]);
      }
    }

    const handleChangeLink = (e) => {
      const newImage = e.target.files[0];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }

    const handleUpload = () => {
      let  newArray = [];
      images.forEach((image,index) => {
       const storageRef = ref(
         storage,
         (index !== 2) ? `images/${Date.now()}-${image.name}` : `audio/${image.name}`
       );
       const uploadTask = uploadBytesResumable(storageRef, image);
 
       uploadTask.on(
         "state_changed",
         (snapshot) => {
           setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
         },
   
         (error) => {
           console.log(error);
         },
         () => {
             getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
               newArray.push(downloadUrl);
               if(newArray.length === 3){
                 console.log(newArray)
                 const data = {
                   title: title,
                   duration: duration,
                   releaseDate: date,
                   thumbnail: newArray[0],
                   thumbnailM: newArray[1],
                   link: newArray[2],
                   userName : user.name,
                   artistsNames : selectedOption.map((option) => option.value),
                   genreIds : selectedOptionGenre.map((option) => option.value),
                 }
                 const handerSave =  async() => {
                   try{
                     const songData = await saveNewSong(data);
                     if(songData){
                       dispatch({ type: actionType.ADD_SONG, payload: songData });
                       setIsOpen(false);
                     }
                   } catch(e){
                     console.log(e);
                   }
                 };
                 handerSave();
               }});
             });
         });
    }
    useEffect(() => {
      const fetchData = async() => {
        try {
          const res = await axios.get("http://localhost:5000/api/admin/artist/name");
          const result = await axios.get("http://localhost:5000/api/admin/artist/genre");
          setOptionsArtist(res.data);
          setOptionsGenre(result.data)
        } catch (e) {
          console.log(e);
        }
      };
      fetchData();
    },[]);
    
  return (
    <div className="absolute w-80vw h-90vh bg-white top-10 right-10 rounded-lg">
        <div className="relative w-full h-full">
            <div className="absolute top-[20px] right-[20px] ">
              <button className="text-3xl" onClick={() => setIsOpen(false)}>
                <MdOutlineCancel className="fill-red-400"/>
              </button>
            </div>  
            <div className="text-center p-[20px] mb-[20px]">
              <span className="font-bold text-xl">BÀI HÁT</span>
            </div>
            <div className="flex px-80 flex-col gap-5">
                <div className="relative" >
                    <div className="absolute top-0 left-0 w-3.4 h-3.4 text-center flex justify-center items-center "><FaUserAlt /></div>
                    <input type="text" className="w-full px-12 py-4 bg-[#e3e3e3] border-[1px] border-solid border-[#e5e5e5] rounded-sm transition-all ease-in-out duration-300 focus:outline-0 focus:border-[#bd8200]" placeholder="Tên bài hát"  
                    onChange={e => setTitle(e.target.value)}
                    value={title}
                    />
                </div>
                <div className="relative" >
                    <div className="absolute top-0 left-0 w-3.4 h-3.4 text-center flex justify-center items-center "><IoEarth /></div>
                    <input type="text" className="w-full px-12 py-4 bg-[#e3e3e3] border-[1px] border-solid border-[#e5e5e5] rounded-sm transition-all ease-in-out duration-300 focus:outline-0 focus:border-[#bd8200]" placeholder="Thời lượng bài hát" 
                    onChange={e => setDuration(e.target.value)}
                    value={duration}/>
                </div>
                <div className="relative" >
                    <div className="absolute top-0 left-0 w-3.4 h-3.4 text-center flex justify-center items-center "><IoEarth /></div>
                    <input type="date" className="w-full px-12 py-4 bg-[#e3e3e3] border-[1px] border-solid border-[#e5e5e5] rounded-sm transition-all ease-in-out duration-300 focus:outline-0 focus:border-[#bd8200]" placeholder="Thời lượng bài hát" 
                    onChange={e => setDate(e.target.value)}
                    value={date}/>
                </div>
                <div className="relative" >
                    <Select
                      defaultValue={selectedOption}
                      isMulti
                      onChange={setSelectedOption}
                      options={optionsArtist}
                    />
                </div>
                <div className="relative" >
                    <Select
                      defaultValue={selectedOptionGenre}
                      isMulti
                      onChange={setSelectedOptionGenre}
                      options={optionsGenre} 
                    />
                </div>
                <div className="relative flex justify-between items-center">
                  <label htmlFor="images" className="flex gap-2 justify-center items-center "><VscNewFile className="h-[25px] w-[25px] cursor-pointer"/>Thêm ảnh</label> 
                  <input type="file" multiple id="images" accept="image/*" hidden onChange={handleChange}/>
                  <label htmlFor="audio" className="flex gap-2 justify-center items-center "><VscNewFile className="h-[25px] w-[25px] cursor-pointer"/>Thêm link bài hát</label> 
                  <input type="file" id="audio" accept="audio/*" hidden onChange={handleChangeLink}/>
                </div>
                <div className="relative flex items-center justify-center mt-[30px]">
                  <button type="button" className="border-solid border-[1px] px-[30px] py-[10px] flex items-center rounded-md bg-indigo-500" onClick={handleUpload}>
                      <span>Thêm</span>
                  </button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default AddSongs