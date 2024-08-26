import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DataItem {
  id: number;
  _id: string;
  message: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [intervalIsSet, setIntervalIsSet] = useState<NodeJS.Timeout | null>(
    null
  );
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [idToUpdate, setIdToUpdate] = useState<string | null>(null);
  const [objectToUpdate, setObjectToUpdate] = useState<string | null>(null);

  useEffect(() => {
    getDataFromDb();

    if (!intervalIsSet) {
      const interval = setInterval(getDataFromDb, 1000);
      setIntervalIsSet(interval);
    }

    return () => {
      if (intervalIsSet) {
        clearInterval(intervalIsSet);
        setIntervalIsSet(null);
      }
    };
  }, [intervalIsSet]);

  const getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => setData(res.data));
  };

  const putDataToDB = (message: string | null) => {
    const currentIds = data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios
      .post('http://localhost:3001/api/putData', {
        id: idToBeAdded,
        message: message,
      })
      .then(() => getDataFromDb());
  };

  const deleteFromDB = async (idToDelete: string | null) => {
    let objIdToDelete = null;
    if (idToDelete) {
      data.forEach((dat) => {
        if (dat.id === parseInt(idToDelete)) {
          objIdToDelete = dat._id;
        }
      });

      if (objIdToDelete) {
        try {
          await axios.delete('http://localhost:3001/api/deleteData', {
            data: {
              id: objIdToDelete,
            },
          });
          getDataFromDb();
        } catch (error) {
          console.error('Error', error);
        }
      }
    }
  };

  const updateDB = (
    idToUpdate: string | null,
    objectToUpdate: string | null
  ) => {
    let objIdToUpdate = null;

    if (idToUpdate) {
      data.forEach((dat) => {
        if (dat.id === parseInt(idToUpdate)) {
          objIdToUpdate = dat._id;
        }
      });

      axios
        .post('http://localhost:3001/api/updateData', {
          id: objIdToUpdate,
          update: { message: objectToUpdate },
        })
        .then(() => getDataFromDb());
    }
  };

  return (
    <div>
      <ul>
        {data.length <= 0
          ? 'NO DB ENTRIES YET'
          : data.map((dat) => (
              <li style={{ padding: '10px' }} key={dat._id}>
                <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                <span style={{ color: 'gray' }}> data: </span>
                {dat.message}
              </li>
            ))}
      </ul>
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="add something in the database"
          style={{ width: '200px' }}
        />
        <button onClick={() => putDataToDB(message)}>ADD</button>
      </div>
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => setIdToDelete(e.target.value)}
          placeholder="put id of item to delete here"
        />
        <button onClick={() => deleteFromDB(idToDelete)}>DELETE</button>
      </div>
      <div style={{ padding: '10px' }}>
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => setIdToUpdate(e.target.value)}
          placeholder="id of item to update here"
        />
        <input
          type="text"
          style={{ width: '200px' }}
          onChange={(e) => setObjectToUpdate(e.target.value)}
          placeholder="put new value of the item here"
        />
        <button onClick={() => updateDB(idToUpdate, objectToUpdate)}>
          UPDATE
        </button>
      </div>
    </div>
  );
};

export default App;
