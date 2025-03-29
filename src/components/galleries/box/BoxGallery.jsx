// src/components/galleries/BoxGallery.jsx
import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
// Import necessary components
import Wall from '../../Wall';
import VideoWall from '../../VideoWall';
import RoomFloor from '../../RoomFloor';
import RoomCeiling from '../../RoomCeiling';
import PlaceholderObject from '../../PlaceholderObject';
import ArtworkDisplay from '../../artwork/ArtworkDisplay';
import '../../../styles/BoxGallery.css';

// Standardized gallery configuration
const galleryConfig = {
  // Main dimensions
  dimensions: {
    width: 140,
    length: 140,
    height: 20,
    wallThickness: 0.5
  },
  
  // Room layout - improved to ensure proper wall alignment
  rooms: [
    {
      id: 'main',
      position: [0, 0, 0],
      size: [60, 60], // width, length
      doors: [
        { wall: 'north', position: 0.5, width: 7 }, // position is 0-1 along the wall
        { wall: 'east', position: 0.5, width: 7 },
        { wall: 'south', position: 0.5, width: 7 },
        { wall: 'west', position: 0.5, width: 7 }
      ]
    },
    {
      id: 'north',
      position: [0, 0, -45],
      size: [60, 30],
      doors: [
        { wall: 'south', position: 0.5, width: 7 }
      ]
    },
    {
      id: 'east',
      position: [45, 0, 0],
      size: [30, 60],
      doors: [
        { wall: 'west', position: 0.5, width: 7 }
      ]
    },
    {
      id: 'south',
      position: [0, 0, 45],
      size: [60, 30],
      doors: [
        { wall: 'north', position: 0.5, width: 7 }
      ]
    },
    {
      id: 'west',
      position: [-45, 0, 0],
      size: [30, 60],
      doors: [
        { wall: 'east', position: 0.5, width: 7 }
      ]
    }
  ],
  
  // Exhibition settings
  exhibits: {
    spacing: 6, // Space between exhibits in meters
    wallOffset: 0.3 // distance from wall surface in meters
  }
};

const BoxGallery = ({ 
  customConfig = {}, 
  artworks = [],
  debug = false,
  onAddToCart
}) => {
  // Merge custom config with defaults
  const config = { ...galleryConfig, ...customConfig };
  const [showLabels, setShowLabels] = useState(debug);
  const groupRef = useRef();
  
  // Set up gallery scene
  const { camera } = useThree();
  
  // Toggle debug labels on/off with 'L' key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'l') {
        setShowLabels(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Ensure camera maintains proper height and zoom constraints
  useFrame(() => {
    if (camera.position.y < 5) camera.position.y = 5;
    if (camera.position.y > 15) camera.position.y = 15;
  });
  
  // Helper function to determine if a wall is external
  const isExternalWall = (room, wallId, allRooms) => {
    const wallThickness = config.dimensions.wallThickness;
    const halfWidth = room.size[0] / 2;
    const halfLength = room.size[1] / 2;
    
    // Get the center position of the wall
    let wallX = room.position[0];
    let wallZ = room.position[2];
    
    switch(wallId) {
      case 'north':
        wallZ = room.position[2] - halfLength;
        break;
      case 'east':
        wallX = room.position[0] + halfWidth;
        break;
      case 'south':
        wallZ = room.position[2] + halfLength;
        break;
      case 'west':
        wallX = room.position[0] - halfWidth;
        break;
    }
    
    // Check if any other room has a wall at this position
    // with a small tolerance for numerical precision
    const tolerance = wallThickness * 2;
    
    for (const otherRoom of allRooms) {
      if (otherRoom.id === room.id) continue; // Skip self
      
      const otherHalfWidth = otherRoom.size[0] / 2;
      const otherHalfLength = otherRoom.size[1] / 2;
      
      // Check if the other room has a wall that aligns with this one
      switch(wallId) {
        case 'north':
          // If the other room's south wall is adjacent to this north wall
          if (Math.abs(otherRoom.position[2] + otherHalfLength - wallZ) < tolerance &&
              Math.abs(otherRoom.position[0] - wallX) < halfWidth + otherHalfWidth - tolerance) {
            return false;
          }
          break;
        case 'east':
          // If the other room's west wall is adjacent to this east wall
          if (Math.abs(otherRoom.position[0] - otherHalfWidth - wallX) < tolerance &&
              Math.abs(otherRoom.position[2] - wallZ) < halfLength + otherHalfLength - tolerance) {
            return false;
          }
          break;
        case 'south':
          // If the other room's north wall is adjacent to this south wall
          if (Math.abs(otherRoom.position[2] - otherHalfLength - wallZ) < tolerance &&
              Math.abs(otherRoom.position[0] - wallX) < halfWidth + otherHalfWidth - tolerance) {
            return false;
          }
          break;
        case 'west':
          // If the other room's east wall is adjacent to this west wall
          if (Math.abs(otherRoom.position[0] + otherHalfWidth - wallX) < tolerance &&
              Math.abs(otherRoom.position[2] - wallZ) < halfLength + otherHalfLength - tolerance) {
            return false;
          }
          break;
      }
    }
    
    // If no adjacent room was found, this is an external wall
    return true;
  };
  
  // Create a complete room with walls, floor, ceiling
  const Room = ({ 
    id, 
    position, 
    size, 
    doors = [],
    height = config.dimensions.height,
    wallThickness = config.dimensions.wallThickness,
    wallColor = "white",
    allRooms = []
  }) => {
    const halfWidth = size[0] / 2;
    const halfLength = size[1] / 2;
    
    // Define corner points relative to room center
    const corners = {
      northWest: [-halfWidth, 0, -halfLength],
      northEast: [halfWidth, 0, -halfLength],
      southEast: [halfWidth, 0, halfLength],
      southWest: [-halfWidth, 0, halfLength]
    };
    
    // Adjust corner points to the absolute position
    Object.keys(corners).forEach(key => {
      corners[key] = [
        corners[key][0] + position[0],
        corners[key][1] + position[1],
        corners[key][2] + position[2]
      ];
    });
    
    // Find door configuration for each wall
    const getDoor = (wallId) => {
      const door = doors.find(d => d.wall === wallId);
      if (door) {
        return {
          hasDoor: true,
          position: door.position,
          width: door.width,
          height: door.height || 12
        };
      }
      return { hasDoor: false };
    };
    
    // Check if wall is external
    const room = { id, position, size };
    const isNorthExternal = isExternalWall(room, 'north', allRooms);
    const isEastExternal = isExternalWall(room, 'east', allRooms);
    const isSouthExternal = isExternalWall(room, 'south', allRooms);
    const isWestExternal = isExternalWall(room, 'west', allRooms);
    
    return (
      <group>
        {/* Floor */}
        <RoomFloor position={[position[0], position[2]]} size={size} />
        
        {/* Ceiling */}
        <RoomCeiling position={[position[0], position[2]]} size={size} height={height} />
        
        {/* Walls - use VideoWall for inner walls, regular Wall for external walls */}
        {isNorthExternal ? (
          <Wall 
            start={corners.northWest} 
            end={corners.northEast} 
            height={height}
            thickness={wallThickness}
            color={wallColor}
            {...getDoor('north')}
          />
        ) : (
          <VideoWall
            start={corners.northWest} 
            end={corners.northEast} 
            height={height}
            thickness={wallThickness}
          />
        )}

        {isEastExternal ? (
          <Wall 
            start={corners.northEast} 
            end={corners.southEast}
            height={height}
            thickness={wallThickness}
            color={wallColor}
            {...getDoor('east')}
          />
        ) : (
          <VideoWall
            start={corners.northEast} 
            end={corners.southEast}
            height={height}
            thickness={wallThickness}
          />
        )}

        {isSouthExternal ? (
          <Wall 
            start={corners.southEast} 
            end={corners.southWest}
            height={height}
            thickness={wallThickness}
            color={wallColor}
            {...getDoor('south')}
          />
        ) : (
          <VideoWall
            start={corners.southEast} 
            end={corners.southWest}
            height={height}
            thickness={wallThickness}
          />
        )}

        {isWestExternal ? (
          <Wall 
            start={corners.southWest} 
            end={corners.northWest}
            height={height}
            thickness={wallThickness}
            color={wallColor}
            {...getDoor('west')}
          />
        ) : (
          <VideoWall
            start={corners.southWest} 
            end={corners.northWest}
            height={height}
            thickness={wallThickness}
          />
        )}
      </group>
    );
  };
  
  // Generate artwork positions distributed across the gallery
  const generateArtworkPositions = () => {
    let artPositions = [];
    let index = 0;
    
    config.rooms.forEach(room => {
      const halfWidth = room.size[0] / 2;
      const halfLength = room.size[1] / 2;
      const wallHeight = config.dimensions.height;
      const wallOffset = config.exhibits.wallOffset;
      
      // Get doors information
      const doorWalls = room.doors ? room.doors.map(door => door.wall) : [];

      // Check each wall
      const walls = [
        { id: 'north', isExternal: isExternalWall(room, 'north', config.rooms) },
        { id: 'east', isExternal: isExternalWall(room, 'east', config.rooms) },
        { id: 'south', isExternal: isExternalWall(room, 'south', config.rooms) },
        { id: 'west', isExternal: isExternalWall(room, 'west', config.rooms) }
      ];
      
      // Only place artwork on external walls
      walls.filter(wall => wall.isExternal).forEach(wall => {
        const hasDoor = doorWalls.includes(wall.id);
        const effectiveWidth = wall.id === 'north' || wall.id === 'south' ? room.size[0] : room.size[1];
        const doorWidth = hasDoor ? 10 : 0; // Space for door
        const usableWidth = effectiveWidth - doorWidth;
        const spacing = config.exhibits.spacing;
        
        // Calculate how many pieces fit on this wall with spacing
        const pieceWidth = 6; // Average width in meters
        const piecesPerWall = Math.max(1, Math.floor(usableWidth / (pieceWidth + spacing)));
        
        // Calculate positions
        const totalWidth = (piecesPerWall - 1) * (pieceWidth + spacing);
        const startOffset = -totalWidth / 2;
        
        for (let i = 0; i < piecesPerWall; i++) {
          // Skip if we've used all artworks
          if (index >= artworks.length) break;
          
          const offset = startOffset + i * (pieceWidth + spacing);
          let position;
          let rotation;
          
          switch (wall.id) {
            case 'north':
              position = [
                room.position[0] + offset,
                wallHeight / 2,
                room.position[2] - halfLength + wallOffset
              ];
              rotation = [0, 0, 0];
              break;
            case 'east':
              position = [
                room.position[0] + halfWidth - wallOffset,
                wallHeight / 2,
                room.position[2] + offset
              ];
              rotation = [0, -Math.PI / 2, 0];
              break;
            case 'south':
              position = [
                room.position[0] + offset,
                wallHeight / 2,
                room.position[2] + halfLength - wallOffset
              ];
              rotation = [0, Math.PI, 0];
              break;
            case 'west':
              position = [
                room.position[0] - halfWidth + wallOffset,
                wallHeight / 2,
                room.position[2] + offset
              ];
              rotation = [0, Math.PI / 2, 0];
              break;
          }
          
          artPositions.push({
            artwork: artworks[index],
            position,
            rotation,
            wallId: wall.id,
            roomId: room.id
          });
          
          index++;
        }
      });
    });
    
    return artPositions;
  };
  
  // Generate exhibition objects within rooms (avoiding walls)
  const generateExhibitObjects = () => {
    let exhibits = [];
    let index = 0;
    
    config.rooms.forEach(room => {
      // Skip tiny rooms
      if (room.size[0] < 20 || room.size[1] < 20) return;
      
      // Safety margin from walls
      const margin = 5;
      const halfWidth = (room.size[0] / 2) - margin;
      const halfLength = (room.size[1] / 2) - margin;
      
      // Determine exhibit count based on room size
      const roomArea = room.size[0] * room.size[1];
      const exhibitCount = Math.min(5, Math.max(1, Math.floor(roomArea / 300)));
      
      // Different placement strategies based on room shape
      if (room.id === 'main') {
        // Central arrangement for main room
        for (let i = 0; i < exhibitCount; i++) {
          // Skip if we've used all artworks
          if (index + i >= artworks.length) break;
          
          const angle = (i / exhibitCount) * Math.PI * 2;
          const radius = Math.min(halfWidth, halfLength) * 0.6;
          
          const x = room.position[0] + Math.cos(angle) * radius;
          const z = room.position[2] + Math.sin(angle) * radius;
          
          const objectType = i % 2 === 0 ? "sculpture" : 
                           i % 3 === 0 ? "interactive" : "pedestal";
          
          exhibits.push({
            artwork: artworks[index + i],
            position: [x, 1, z],
            size: [3, 3, 3],
            type: objectType,
            roomId: room.id,
            id: `${room.id}-${i}`
          });
        }
        index += exhibitCount;
      } else {
        // Linear arrangement for other rooms
        const isWide = room.size[0] > room.size[1];
        
        for (let i = 0; i < exhibitCount; i++) {
          // Skip if we've used all artworks
          if (index + i >= artworks.length) break;
          
          let x, z;
          
          if (isWide) {
            // Place along x-axis for wide rooms
            x = room.position[0] - halfWidth + (i + 1) * (room.size[0] - 2 * margin) / (exhibitCount + 1);
            z = room.position[2];
          } else {
            // Place along z-axis for long rooms
            x = room.position[0];
            z = room.position[2] - halfLength + (i + 1) * (room.size[1] - 2 * margin) / (exhibitCount + 1);
          }
          
          const objectType = i % 3 === 0 ? "interactive" : 
                           i % 2 === 0 ? "sculpture" : "pedestal";
          
          exhibits.push({
            artwork: artworks[index + i],
            position: [x, 1, z],
            size: [3, 4, 3],
            type: objectType,
            roomId: room.id,
            id: `${room.id}-${i}`
          });
        }
        index += exhibitCount;
      }
    });
    
    return exhibits;
  };
  
  // Calculate the artwork placement positions
  const artworkPositions = generateArtworkPositions();
  // Calculate exhibit object placements
  const exhibitObjects = generateExhibitObjects();

  return (
    <group ref={groupRef}>
      {/* Create all rooms */}
      {config.rooms.map(room => (
        <Room 
          key={room.id}
          {...room}
          height={config.dimensions.height}
          wallThickness={config.dimensions.wallThickness}
          wallColor="white"
          allRooms={config.rooms}
        />
      ))}
      
      {/* Wall artworks */}
      {artworkPositions.map((item, index) => (
        <ArtworkDisplay 
          key={`art-${index}`}
          position={item.position}
          rotation={item.rotation}
          artwork={item.artwork}
          size={[6, 4]}
          wallId={item.wallId}
          onAddToCart={onAddToCart}
        />
      ))}
      
      {/* Exhibition objects */}
      {exhibitObjects.map((exhibit, index) => (
        <PlaceholderObject 
          key={`exhibit-${index}`}
          position={exhibit.position}
          size={exhibit.size}
          type={exhibit.type}
          id={exhibit.id}
          artwork={exhibit.artwork}
          onAddToCart={onAddToCart}
        />
      ))}
      
      {/* Additional lighting */}
      <ambientLight intensity={0.4} />
      
      {/* Main room light */}
      <pointLight 
        position={[0, config.dimensions.height - 2, 0]} 
        intensity={0.6} 
        castShadow 
        shadow-mapSize={[2048, 2048]}
      />
      
      {/* Room-specific lighting */}
      {config.rooms.map((room, index) => (
        <pointLight 
          key={`light-${index}`}
          position={[room.position[0], config.dimensions.height - 4, room.position[2]]} 
          intensity={0.5} 
          castShadow
          color={index % 2 === 0 ? '#ffffff' : '#f0f8ff'}
          distance={Math.max(room.size[0], room.size[1]) * 1.5}
        />
      ))}
      
      {/* Debug information */}
      {showLabels && (
        <Html position={[0, config.dimensions.height - 1, 0]} center>
          <div className="debug-info">
            <div className="debug-title">Box Gallery</div>
            <div>Press 'L' to toggle labels</div>
            <div>{config.rooms.length} rooms, {artworkPositions.length} artworks, {exhibitObjects.length} exhibits</div>
          </div>
        </Html>
      )}
    </group>
  );
};

BoxGallery.propTypes = {
  customConfig: PropTypes.object,
  artworks: PropTypes.array,
  debug: PropTypes.bool,
  onAddToCart: PropTypes.func
};

export default BoxGallery;