import './transport.css';
import React from 'react';
import { Set } from '../audio/dataInterfaces';

interface Props {
  set: Set;
  loadSet: (set: Set) => void;
}

const SetCard: React.FC<Props> = ({ set, loadSet }) => { 
  return (
    <div onClick={() => loadSet(set)} className='set-menu-item' key={set.id}>
      <p>{set.name}</p>
    </div>
  )
}

export default SetCard;
