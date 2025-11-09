export interface Game {
  id: number;
  name: string;
  genre: string;
  releaseDate: string;
  ownerId: number;
}

export interface CreateGameDto {
  name: string;
  genre: string;
  releaseDate: string;
  ownerId: number;
}

export interface UpdateGameDto {
  name?: string;
  genre?: string;
  releaseDate?: string;
}
