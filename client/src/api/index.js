import axios from "axios";

const baseURL = "http://localhost:5000/";

export const validateUser = async (token) => {
  try {
    const res = await axios.get(`${baseURL}api/me`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    return res.data;
  } catch (error) {
    return null;
  }
};


export const getAllArtist = async () => {
  try {
    const res = await axios.get(`${baseURL}api/admin/artist`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getAllNameArtist = async () => {
  try {
    const res = await axios.get(`${baseURL}api/admin/artist/name`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const saveNewArtist = async (data) => {
  try {
    const res = await axios.post(`${baseURL}api/admin/artist/create`, { ...data });
    return  res.data;
  } catch (error) {
    return null;
  }
};

export const removeArtist = async (id) => {
  try {
     await axios.delete(`${baseURL}api/admin/artist/delete/${id}`);
  } catch (error) {
    return null;
  }
};


export const getAllSong = async () => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track`);
    return res.data;
  } catch (error) {
    return null;
  }
};

//update plays_count
export const updatePlayCount = async (id, count) => {
  try {
    const res = await axios.put(`${baseURL}api/admin/track/update/plays_count`,  { 
      _id: id ,
      plays_count:count + 1,
    });
    return res.data;
  } catch (error) {
    return null;
  }
};


export const saveNewSong = async (data) => {
  try {
    const res = await axios.post(`${baseURL}api/admin/track/create`, { ...data });
    return  res.data;
  } catch (error) {
    return null;
  }
};

///get all songs of zing-chart
export const getZingChart = async () => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track/zing-chart`);
    return res.data;
  } catch (error) {
    return null;
  }
};

//get all songs like of one user
export const getSongsLike = async (id) => {
  try {
    const res = await axios.get(`${baseURL}api/me/${id}/tracks/like`);
    return res.data;
  } catch (error) {
    return null;
  }
};

//like song
export const putLikeSong = async ({idUser , idTrack}) => {
  try {
    const res = await axios.put(`${baseURL}api/me/like/track/${idTrack}`,{id: idUser});
    await axios.put(`${baseURL}api/admin/track/update/like/${idTrack}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

//dislike song
export const putDislikeSong = async ({idUser , idTrack}) => {
  try {
    const res = await axios.put(`${baseURL}api/me/dislike/track/${idTrack}`,{id: idUser});
    await axios.put(`${baseURL}api/admin/track/update/dislike/${idTrack}`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const createPlaylist = async(data) => {
  try {
    const res = await axios.post(`${baseURL}api/abum/create`,{...data});
    return res.data;
  } catch (error) {
    return null;
  }
}

export const getAllPlaylist = async(id) => {
  try {
    const res = await axios.get(`${baseURL}api/abum/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
}

export const addTrackPlaylist = async(id, data) => {
  try {
    const res = await axios.put(`${baseURL}api/abum/update/${id}`, { ...data });
    return res.data;
  } catch (error) {
    return null;
  }
}

//get tracks relate with playlist
export const getRelateTrack = async(data) => {
  
  try {
    const res = await axios.post(`${baseURL}api/admin/track/genre`, { genreIds: data });
      return res.data;
    } catch (error) {
      return null;
  }
} 

//remove tracks from the playlist
export const deleteTrackFromPlaylist = async(idPlaylist, idTrack) => {
  console.log(idPlaylist,idTrack)
  try {
    const res = await axios.put(`${baseURL}api/abum/remove/${idPlaylist}`, { id: idTrack });
      return res.data;
    } catch (error) {
      return null;
  }
} 

//get track by id 
export const getTrackbyId = async(id) => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track/${id}`);
    return res.data;
  } catch (error) {
    return null;
  }
}

export const getNewTracks = async () => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track/newtracks`);
    return res.data;
  } catch (error) {
    return null;
  }
}

export const getAllNewTracks = async () => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track/all/newtracks`);
    return res.data;
  } catch (error) {
    return null;
  }
}

export const getInfoArtist = async (nameArtist) => {
  try {
    const res = await axios.post(`${baseURL}api/admin/artist/info`, { name: nameArtist});
    return res.data[0];
  } catch (error) {
    return null;
  }
}

export const getPopularTrackOfArtist = async (nameArtist) => {
  try {
    const res = await axios.post(`${baseURL}api/admin/track/artist/populate`, { artistName: nameArtist});
    return res.data;
  } catch (error) {
    return null;
  }
}

export const searchAll = async(query) => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track/v2/all/search?q=${query}`);
    return res.data;
  } catch(error) {
    return null;
  }
}

export const searchTextAll = async(query) => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track/v2/text/search?q=${query}`);
    return res.data;
  } catch(error) {
    return null;
  }
}

export const getAllResults = async (query) => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track/v2/max-all/search?q=${query}`)
    return res.data;
  } catch(error) {
    return null;
  }
}

export const getAllTrackResults = async (query) => {
  try {
    const res = await axios.get(`${baseURL}api/admin/track/v2/search?q=${query}`)
    return res.data;
  } catch(error) {
    return null;
  }
}

export const getAllPlaylistResults = async (query) => {
  try {
    const res = await axios.get(`${baseURL}api/abum/v2/search?q=${query}`)
    return res.data;
  } catch(error) {
    return null;
  }
}

export const getAllArtistResults = async (query) => {
  try {
    const res = await axios.get(`${baseURL}api/admin/artist/v2/search?q=${query}`)
    return res.data;
  } catch(error) {
    return null;
  }
}

export const getPlaylistById = async(id) => {
  try {
    const res = await axios.get(`${baseURL}api/abum/playlist/${id}`);
    return res.data;
  } catch(error) {
    return null;
  }
}
