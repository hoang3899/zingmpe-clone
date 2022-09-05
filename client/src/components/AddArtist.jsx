import React, { useState } from 'react'
import { MdOutlineCancel } from 'react-icons/md'
import { FaUserAlt } from 'react-icons/fa'
import { IoEarth } from 'react-icons/io5'
import { VscNewFile } from 'react-icons/vsc'

import { storage } from '../firebase.config'
import {  saveNewArtist } from '../api'
import { actionType } from '../context/reducer'
import { useStateValue } from '../context/StateProvider'

import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

const AddArtist = ({setIsOpenAdd}) => {
  
  const [images, setImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [name, setName] = useState("");
  const [national, setNational] = useState("");
  const [biography, setBiography] = useState("");

  const [ { artists } , dispatch ] = useStateValue();

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const handleUpload = async() => {
        let  newArray = [];
       images.forEach((image) => {
        const storageRef = ref(
          storage,
          `images/${Date.now()}-${image.name}`
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
                if(newArray.length === 2){
                  console.log(newArray)
                  const data = {
                    name: name,
                    national: national,
                    biography: biography,
                    thumbnail: newArray[0],
                    thumbnailM: newArray[1]
                  }
                  const handerSave =  async() => {
                    try{
                      const artistData = await saveNewArtist(data);
                      if(artistData){
                        dispatch({ type: actionType.ADD_ARTISTS, artists: artistData });
                        setIsOpenAdd(false);
                      }
                    } catch(e){
                      console.log(e);
                    }
                  };
                  handerSave();
                }});
              });
          });
      };

  return (
    <div className="absolute w-80vw h-90vh bg-white top-10 right-10 rounded-lg">
        <div className="relative w-full h-full">
            <div className="absolute top-[20px] right-[20px] ">
              <button className="text-3xl" onClick={() => setIsOpenAdd(false)}>
                <MdOutlineCancel className="fill-red-400"/>
              </button>
            </div>  
            <div className="text-center p-[20px] mb-[20px]">
              <span className="font-bold text-xl">NGHỆ SĨ</span>
            </div>
            <div className="flex px-80 flex-col gap-5">
                <div className="relative" >
                    <div className="absolute top-0 left-0 w-3.4 h-3.4 text-center flex justify-center items-center "><FaUserAlt /></div>
                    <input type="text" className="w-full px-12 py-4 bg-[#e3e3e3] border-[1px] border-solid border-[#e5e5e5] rounded-sm transition-all ease-in-out duration-300 focus:outline-0 focus:border-[#bd8200]" placeholder="Tên"  
                    onChange={e => setName(e.target.value)}
                    value={name}
                    />
                </div>
                <div className="relative" >
                    <div className="absolute top-0 left-0 w-3.4 h-3.4 text-center flex justify-center items-center "><IoEarth /></div>
                    <input type="text" className="w-full px-12 py-4 bg-[#e3e3e3] border-[1px] border-solid border-[#e5e5e5] rounded-sm transition-all ease-in-out duration-300 focus:outline-0 focus:border-[#bd8200]" placeholder="Quốc gia" 
                    onChange={e => setNational(e.target.value)}
                    value={national}/>
                </div>
                <div className="relative">
                  <textarea className="w-full px-4 py-2 bg-[#e3e3e3] border-[1px] border-solid border-[#e5e5e5] rounded-sm transition-all ease-in-out duration-300 focus:outline-0 focus:border-[#bd8200]" id="" cols="30" rows="4" placeholder="Mô tả..."
                  value={biography}
                  onChange={e => setBiography(e.target.value)}
                  ></textarea>
                </div>
                <div className="relative">
                  <label htmlFor="images" className="flex gap-2 justify-center items-center "><VscNewFile className="h-[25px] w-[25px] cursor-pointer"/>Thêm ảnh</label> 
                  <input type="file" multiple id="images" accept="image/*" hidden onChange={handleChange}/>
                </div>
                <div className="relative flex items-center justify-center mt-[30px]">
                  <button type="button" className="border-solid border-[1px] px-[30px] py-[10px] flex items-center rounded-md bg-indigo-500" onClick={handleUpload}>
                      <span>Thêm</span>
                  </button>
                </div>
            </div>
        </div>
    </div>
  );
}

export default AddArtist