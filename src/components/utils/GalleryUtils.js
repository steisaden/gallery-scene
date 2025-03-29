// src/components/utils/GalleryUtils.js
import * as THREE from 'three';

/**
 * GalleryUtils - Utility functions for gallery components
 * Contains functions for determining wall properties, positioning artworks, etc.
 */

/**
 * Determine if a wall is external (not adjacent to another room)
 * 
 * @param {Object} room - Room data object
 * @param {string} wallId - Wall identifier ('north', 'east', 'south', 'west')
 * @param {Array} allRooms - Array of all rooms
 * @param {number} wallThickness - Thickness of walls
 * @returns {boolean} True if wall is external (no adjacent room)
 */
export const isExternalWall = (room, wallId, allRooms, wallThickness) => {
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
  
  /**
   * Generate artwork positions distributed evenly across each visible wall
   * 
   * @param {Array} rooms - Array of room objects
   * @param {Object} config - Gallery configuration
   * @param {Array} artworks - Array of artwork objects
   * @returns {Array} Array of artwork position objects
   */
  export const generateArtworkPositions = (rooms, config, artworks = []) => {
    let artPositions = [];
    let artworkIndex = 0;
    
    // Process each room's walls
    rooms.forEach(room => {
      const halfWidth = room.size[0] / 2;
      const halfLength = room.size[1] / 2;
      const wallHeight = config.dimensions.height;
      const wallOffset = config.exhibits.wallOffset;
      
      // Extract detailed door information for checking
      const doorDetails = [];
      if (room.doors) {
        room.doors.forEach(door => {
          let doorPos = [0, 0, 0];
          let doorWidth = door.width || 7;
          
          // Calculate actual position of door in world space
          switch(door.wall) {
            case 'north':
              doorPos = [
                room.position[0] + (door.position - 0.5) * room.size[0],
                wallHeight / 2,
                room.position[2] - halfLength
              ];
              doorDetails.push({
                wall: 'north',
                center: doorPos,
                width: doorWidth,
                direction: 'horizontal'
              });
              break;
            case 'east':
              doorPos = [
                room.position[0] + halfWidth,
                wallHeight / 2,
                room.position[2] + (door.position - 0.5) * room.size[1]
              ];
              doorDetails.push({
                wall: 'east',
                center: doorPos,
                width: doorWidth,
                direction: 'vertical'
              });
              break;
            case 'south':
              doorPos = [
                room.position[0] + (door.position - 0.5) * room.size[0],
                wallHeight / 2,
                room.position[2] + halfLength
              ];
              doorDetails.push({
                wall: 'south',
                center: doorPos,
                width: doorWidth,
                direction: 'horizontal'
              });
              break;
            case 'west':
              doorPos = [
                room.position[0] - halfWidth,
                wallHeight / 2,
                room.position[2] + (door.position - 0.5) * room.size[1]
              ];
              doorDetails.push({
                wall: 'west',
                center: doorPos,
                width: doorWidth,
                direction: 'vertical'
              });
              break;
          }
        });
      }
      
      // Get walls with doors
      const doorWalls = room.doors ? room.doors.map(door => door.wall) : [];
  
      // Filter walls - only use external walls
      const walls = [
        { 
          id: 'north', 
          hasDoor: doorWalls.includes('north'),
          isExternal: isExternalWall(room, 'north', rooms, config.dimensions.wallThickness)
        },
        { 
          id: 'east', 
          hasDoor: doorWalls.includes('east'),
          isExternal: isExternalWall(room, 'east', rooms, config.dimensions.wallThickness)
        },
        { 
          id: 'south', 
          hasDoor: doorWalls.includes('south'),
          isExternal: isExternalWall(room, 'south', rooms, config.dimensions.wallThickness)
        },
        { 
          id: 'west', 
          hasDoor: doorWalls.includes('west'),
          isExternal: isExternalWall(room, 'west', rooms, config.dimensions.wallThickness)
        }
      ];
      
      // Only place artwork on external walls
      walls.filter(wall => wall.isExternal).forEach(wall => {
        const effectiveWidth = wall.id === 'north' || wall.id === 'south' ? room.size[0] : room.size[1];
        const doorWidth = wall.hasDoor ? 10 : 0; // Extra space around doors
        const usableWidth = effectiveWidth - doorWidth;
        const spacing = config.exhibits.spacing;
        
        // Calculate how many pieces fit on this wall with even spacing
        const pieceWidth = 6; // Average width in meters
        const piecesPerWall = Math.max(1, Math.floor(usableWidth / (pieceWidth + spacing)));
        
        // Calculate start position and step size for even distribution
        const totalWidth = (piecesPerWall - 1) * (pieceWidth + spacing);
        const startOffset = -totalWidth / 2;
        
        for (let i = 0; i < piecesPerWall; i++) {
          // Skip if we're out of artworks
          if (artworkIndex >= artworks.length) break;
          
          // Calculate the offset for this artwork
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
            default:
              position = [0, 0, 0];
              rotation = [0, 0, 0];
          }
          
          // Check if position is near any doorway
          let isInDoorway = false;
          doorDetails.forEach(door => {
            // Skip checking doors that aren't on this wall
            if (door.wall !== wall.id) return;
            
            // Check if artwork position overlaps with doorway
            const doorHalfWidth = door.width / 2;
            
            if (door.direction === 'horizontal') {
              // For north/south walls - check X coordinate
              if (Math.abs(position[0] - door.center[0]) < doorHalfWidth + pieceWidth/2) {
                isInDoorway = true;
              }
            } else {
              // For east/west walls - check Z coordinate
              if (Math.abs(position[2] - door.center[2]) < doorHalfWidth + pieceWidth/2) {
                isInDoorway = true;
              }
            }
          });
          
          // Only add artwork position if it's not in a doorway
          if (!isInDoorway) {
            artPositions.push({
              artwork: artworks[artworkIndex],
              position,
              rotation,
              wallId: wall.id,
              roomId: room.id
            });
            
            artworkIndex++;
          }
        }
      });
    });
    
    return artPositions;
  };
  
  /**
   * Generate exhibition objects within rooms (avoiding walls)
   * 
   * @param {Array} rooms - Array of room objects
   * @param {Object} config - Gallery configuration
   * @param {Array} artworks - Array of artwork objects
   * @returns {Array} Array of exhibit position objects
   */
  export const generateExhibitObjects = (rooms, config, artworks = []) => {
    let exhibits = [];
    let artworkIndex = 0;
    
    rooms.forEach(room => {
      // Skip tiny rooms or specifically exclude some
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
          // Skip if we're out of artworks
          if (artworkIndex >= artworks.length) break;
          
          const angle = (i / exhibitCount) * Math.PI * 2;
          const radius = Math.min(halfWidth, halfLength) * 0.6;
          
          const x = room.position[0] + Math.cos(angle) * radius;
          const z = room.position[2] + Math.sin(angle) * radius;
          
          const objectType = i % 2 === 0 ? "sculpture" : 
                           i % 3 === 0 ? "interactive" : "pedestal";
          
          exhibits.push({
            artwork: artworks[artworkIndex],
            position: [x, 1, z],
            size: [3, 3, 3],
            type: objectType,
            roomId: room.id,
            id: `${room.id}-${i}`
          });
          
          artworkIndex++;
        }
      } else {
        // Linear arrangement for other rooms
        // Determine the axis based on room shape
        const isWide = room.size[0] > room.size[1];
        
        for (let i = 0; i < exhibitCount; i++) {
          // Skip if we're out of artworks
          if (artworkIndex >= artworks.length) break;
          
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
            artwork: artworks[artworkIndex],
            position: [x, 1, z],
            size: [3, 4, 3],
            type: objectType,
            roomId: room.id,
            id: `${room.id}-${i}`
          });
          
          artworkIndex++;
        }
      }
    });
    
    return exhibits;
  };
  
  /**
   * Generate rotation quaternion from Euler angles
   * 
   * @param {Array} rotation - [x, y, z] rotation in radians
   * @returns {THREE.Quaternion} Quaternion
   */
  export const eulerToQuaternion = (rotation) => {
    // This function requires THREE.js to be imported where it's used
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler(rotation[0], rotation[1], rotation[2], 'XYZ');
    quaternion.setFromEuler(euler);
    return quaternion;
  };
  
  /**
   * Check if position is inside a room
   * 
   * @param {Array} position - [x, y, z] position
   * @param {Object} room - Room object
   * @param {number} margin - Safety margin
   * @returns {boolean} True if position is inside room
   */
  export const isInsideRoom = (position, room, margin = 0) => {
    const halfWidth = room.size[0] / 2 - margin;
    const halfLength = room.size[1] / 2 - margin;
    
    return (
      position[0] >= room.position[0] - halfWidth &&
      position[0] <= room.position[0] + halfWidth &&
      position[2] >= room.position[2] - halfLength &&
      position[2] <= room.position[2] + halfLength
    );
  };
  
 const galleryUtils = {
    isExternalWall,
    generateArtworkPositions,
    generateExhibitObjects,
    eulerToQuaternion,
    isInsideRoom
  };

  export default galleryUtils;