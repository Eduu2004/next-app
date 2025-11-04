import React from "react";

interface Props {
  params: { id: number; photosId: number };
}

const PhotosId = ({ params: { id, photosId } }: Props) => {
  return (
    <div>
      PhotosPage {id} {photosId}
    </div>
  );
};

export default PhotosId;
