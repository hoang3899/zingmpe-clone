export const actionType = {
    SET_USER: "SET_USER",
    SET_ALL_SONGS: "SET_ALL_SONGS",
    SET_SONG: "SET_SONG",
    SET_SONG_PLAYING: "SET_SONG_PLAYING",
    SET_MINI_PLAYER: "SET_MINI_PLAYER",
    ADD_ARTISTS: "ADD_ARTISTS",
    REMOVE_ARTISTS: "REMOVE_ARTISTS",
    SET_LISTEN_SONG: "SET_LISTEN_SONG",
    SET_SONGS_WAIT: "SET_SONGS_WAIT",
    SET_SONGS_LIKE: "SET_SONGS_LIKE",
    REMOVE_SONG_DISLIKE: "REMOVE_SONG_DISLIKE",
    ADD_SONG_LIKE: "ADD_SONG_LIKE",
    CREATE_PLAYLIST: "CREATE_PLAYLIST",
    SET_SONGWAIT_PLAYLIST: "SET_SONGWAIT_PLAYLIST",
    CLOSE_ADD_PLAYLIST: "CLOSE_ADD_PLAYLIST",
    SET_PLAYLIST: "SET_PLAYLIST",
    SET_ALL_PLAYLIST: "SET_ALL_PLAYLIST",
    UPDATE_PLAYLIST: "UPDATE_PLAYLIST",
    INFO_TRACK: "INFO_TRACK",
    REMOVE_INFO_TRACK: "REMOVE_INFO_TRACK",
    GET_ALL_SONG_AD: "GET_ALL_SONG_AD",
    SET_ARTISTS: "SET_ARTISTS",
    SET_RELATE_TRACK: "SET_RELATE_TRACK",
    REMOVE_TRACK_RELATE: "REMOVE_TRACK_RELATE",
    UPDATE_CURRENT_PLAYLIST:"UPDATE_CURRENT_PLAYLIST",
    REMOVE_TRACK_CURRENT_PLAYLIST:"REMOVE_TRACK_CURRENT_PLAYLIST",
    SET_SONG_FRAME: "SET_SONG_FRAME",
    ADD_TRACK_TO_NEXT_UP: "ADD_TRACK_TO_NEXT_UP",
    UPDATE_SONG_INDEX: "UPDATE_SONG_INDEX",
    ADD_TO_PLAYLIST: "ADD_TO_PLAYLIST",
    GET_NAME_ARTIST: "GET_NAME_ARTIST",
    SET_OPEN_SUB_INFO_TRACK: "SET_OPEN_SUB_INFO_TRACK",
    SET_OWNER_PLAYLIST: "SET_OWNER_PLAYLIST",
    SET_NO_OWNER_PLAYLIST: "SET_NO_OWNER_PLAYLIST",
    SET_TEXT_SEARCH: "SET_TEXT_SEARCH",
};


const reducer = (state, action) => {
    console.log(action);
  
    switch (action.type) {
      case actionType.SET_USER:
        return {
          ...state,
          user: action.user,
        };

      //all artists by admin
      case actionType.SET_ARTISTS:
        return {
          ...state,
          artists: action.artists,
        };
      
      //add new artist
      case actionType.ADD_ARTISTS:
        return {
          ...state,
          artists: [...state.artists,action.artists],
        };

      //delete artist
      case actionType.REMOVE_ARTISTS:
        const removeArtist = state.artists.filter(artist => artist._id !== action.payload._id);
        return {
          ...state,
          artists: removeArtist,
        };

      //all songs by admin
      case actionType.SET_ALL_SONGS:
        const updateRandomId = action.payload.map(v => ({...v, randomId: Math.random().toString()}))
        return {
          ...state,
          songs: updateRandomId,
        };

        //add new artist
      case actionType.ADD_SONG:
        return {
          ...state,
          songs: [...state.songs,action.payload],
        };

      case actionType.SET_SONG:
        return {
          ...state,
          songIndex: action.payload,
        };

      case actionType.SET_LISTEN_SONG:
          const songsUpdate = state.songs.map(song => {
            if(song._id === action.payload._id){
              const updatePlayCounts = song.plays_count + 1;
              return {
                ...song,
                plays_count:updatePlayCounts,
              }
            } else {
              return song;
            }
          })
          return {
            ...state,
            songs: songsUpdate,
          };
        
      case actionType.SET_SONGS_WAIT:
          return {
            ...state,
            songsWait: action.payload,
          };
        
      case actionType.SET_ALL_PLAYLIST: 
        return {
          ...state,
          allPlaylist: action.payload,
        };
        
      case actionType.SET_SONG_PLAYING:
          return {
            ...state,
            isSongPlaying: action.payload,
          };

      case actionType.SET_SONGS_LIKE:
          return {
            ...state,
            songsLike:action.payload,
          };

      case actionType.ADD_SONG_LIKE:
          const newLikes = [...state.user.likes,action.payload._id];
          const newUser = Object.assign(state.user, { likes: newLikes });
          return {
            ...state,
            user: newUser,
            songsLike:[...state.songsLike, action.payload],
          };

      case actionType.CREATE_PLAYLIST: 
        const newAllPlaylists = [...state.allPlaylist , action.payload];
        return {
          ...state,
          currentPlaylist:action.payload,
          allPlaylist: newAllPlaylists,
        };
            
      case actionType.UPDATE_PLAYLIST:
        const newAllPlaylist = state.allPlaylist.map((playlist) => {
          if(playlist._id === action.payload[0]._id) {
            const newTracks = [...playlist.tracks,action.payload[1]];
            return {
              ...playlist,
              tracks: newTracks,
            };
          } else {
            return playlist;
          }
        });
        return {
          ...state,
          songInfo: null,
          allPlaylist: newAllPlaylist,
        };
      
      case actionType.INFO_TRACK: 
        return {
          ...state,
          isOpenInfoTrack: true,
          positionX: action.payload[0],
          positionY: action.payload[1],
          songInfo: action.payload[2],
        }
      
      case actionType.REMOVE_INFO_TRACK: 
        return {
          ...state,
          songInfo:null,
        }
        
      case actionType.SET_PLAYLIST: 
       return {
        ...state,
        currentPlaylist: action.payload,
       }
      //admin
      case actionType.GET_ALL_SONG_AD:
        return {
          ...state,
          allSongAd: action.payload,
        }

      case actionType.SET_OPEN_SUB_INFO_TRACK:
        return {
          ...state,
          positionX:null,
          positionY:null,
          songInfo: null,
          isOpenInfoTrack:false,
        }

      case actionType.SET_RELATE_TRACK:
        return {
          ...state,
          relateTrack: action.payload,
        }
      
      case actionType.UPDATE_CURRENT_PLAYLIST:
        const newPlaylist = {
          ...state.currentPlaylist,
          tracks: [...state.currentPlaylist.tracks, action.payload],
        };
        return {
          ...state,
          currentPlaylist: newPlaylist,
        }

      case actionType.REMOVE_TRACK_CURRENT_PLAYLIST:{
        const removedTrack = state.currentPlaylist.tracks.filter((track) => track._id !== action.payload[1])
        const updatePlaylist = {
          ...state.currentPlaylist,
          tracks: removedTrack,
        };
        const updateAllPlaylist = state.allPlaylist.map((playlist) => {
          if(playlist._id === action.payload[0]){
            return updatePlaylist;
          } else {
            return playlist;
          }
        })
        return {
          ...state,
          songInfo:null,
          allPlaylist: updateAllPlaylist,
          currentPlaylist: updatePlaylist,
        }
      }
      
      case actionType.REMOVE_TRACK_RELATE:
        const removedTracks = state.relateTrack.filter((track) => track._id !== action.payload._id)
        return {
          ...state,
          relateTrack: removedTracks,
        }
      
      case actionType.SET_SONG_FRAME:
        return {
          ...state,
          songs: action.payload[0],
          songIndex: action.payload[1],
        }

      case actionType.UPDATE_SONG_INDEX:
        return {
          ...state,
          songIndex: action.payload,
        }

    
    case actionType.SET_OWNER_PLAYLIST:
      return {
        ...state,
        isOwnerPlaylist:true,
        idPlaylistCurrent:action.payload,
      }
    case actionType.SET_NO_OWNER_PLAYLIST:
      return {
        ...state,
        isOwnerPlaylist:false,
        idPlaylistCurrent:null,
      }
    case actionType.SET_TEXT_SEARCH: 
    return {
      ...state,
      textSearch:action.payload,
    }
    
      case actionType.ADD_TRACK_TO_NEXT_UP: 
      var updatedList = [...state.songs];
      const updateSongInfo = state.songInfo;
      updateSongInfo["randomId"] =  Math.random().toString();
      updatedList.splice(state.songIndex + 1 , 0, updateSongInfo);
      const newSongsUpdate = updatedList.map(v => ({...v, randomId: Math.random().toString()}))
      return {
        ...state,
        songs: newSongsUpdate,
        songInfo: null,
      }  

      case actionType.ADD_TO_PLAYLIST: 
      let newList = [...state.songs];
      const newSongInfo = state.songInfo;
      newSongInfo["randomId"] =  Math.random().toString();
      newList.push(newSongInfo);
      return {
        ...state,
        songs:newList,
        songInfo: null,
      }

      case actionType.GET_NAME_ARTIST: 
        return {
          ...state,
          nameArtist: action.payload,
        }
      

      case actionType.REMOVE_SONG_DISLIKE:
        const songs = state.songsLike?.filter((song) => song._id !== action.payload);
        const newLikes01 = state.user?.likes.filter((like) => like !== action.payload);
        const newUser01 = Object.assign(state.user, { likes: newLikes01 });
        return {
          ...state,
          user:newUser01,
          songsLike:songs,
        };
          
     
          
      default:
        return state;
    }
  };
  
  export default reducer;
