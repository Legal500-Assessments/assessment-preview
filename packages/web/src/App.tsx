import styles from './App.module.css';

function App() {
  const characters = [
    { 
      Name: 'Dark Shadow', 
      type: 'Hero', 
      studio: 'Cosmic Comics',
      description: 'A mysterious vigilante who can manipulate shadows and darkness to fight crime',
      image: '/characters/dark-shadow.png'
    },
    { 
      Name: 'Professor Light', 
      type: 'Villain', 
      studio: 'Cosmic Comics',
      description: 'A brilliant scientist corrupted by power, using light-based technology for evil',
      image: '/characters/professor-light.png'
    },
    { 
      Name: 'Thunder Woman', 
      type: 'Hero', 
      studio: 'Epic Entertainment',
      description: 'An immortal warrior princess with the power to control lightning',
      image: '/characters/thunder-woman.png'
    },
    { 
      Name: 'Mind Master', 
      type: 'Villain', 
      studio: 'Epic Entertainment',
      description: 'A powerful telepath who seeks to control the minds of everyone on Earth',
      image: '/characters/mind-master.png'
    },
    {
      Name: 'Flame Knight', 
      type: 'Hero', 
      studio: 'Cosmic Comics',
      description: 'A noble warrior blessed with the ancient power of eternal flame',
      image: '/characters/flame-knight.png'
    },
    { 
      Name: 'Ice Queen', 
      type: 'Villain', 
      studio: 'Epic Entertainment',
      description: 'A cold-hearted ruler who wants to plunge the world into eternal winter',
      image: '/characters/ice-queen.png'
    },
    { 
      Name: 'Wind Rider', 
      type: 'Hero', 
      studio: 'Cosmic Comics',
      description: 'A free-spirited hero who soars through the skies protecting the innocent',
      image: '/characters/wind-rider.png'
    },
    { 
      Name: 'Time Lord', 
      type: 'Villain', 
      studio: 'Epic Entertainment',
      description: 'A mad scientist who has mastered time manipulation for personal gain',
      image: '/characters/time-lord.png'
    },
    { 
      Name: 'Earth Guardian', 
      type: 'Hero', 
      studio: 'Cosmic Comics',
      description: 'An ancient spirit of nature who protects the planet from destruction',
      image: '/characters/earth-guardian.png'
    },
    { 
      Name: 'Chaos King', 
      type: 'Villain', 
      studio: 'Epic Entertainment',
      description: 'An immortal being whose sole purpose is to spread disorder across the universe',
      image: '/characters/chaos-king.png'
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Heroes vs Villains</h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Type</th>
              <th>Studio</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character, index) => (
              <>
                <tr key={`${index}-main`}>
                  <td>
                    <img 
                      src={character.image} 
                      alt={character.Name}
                      className={styles.characterImage}
                    />
                  </td>
                  <td>{character.Name}</td>
                  <td className={styles.description}>
                    {character.description}
                  </td>
                  <td>{character.type}</td>
                  <td>{character.studio}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App; 