'use client';

import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css'; // required core styles
import 'yet-another-react-lightbox/plugins/thumbnails.css'; // optional

export default function Gallery({ images }) {
    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    // Format images for the lightbox
    const slides = images.map((src) => ({ src }));

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, idx) => (
                    <img
                        key={idx}
                        src={img}
                        alt={`Image ${idx + 1}`}
                        className="w-full h-40 object-cover cursor-pointer rounded"
                        onClick={() => {
                            setIndex(idx);
                            setOpen(true);
                        }}
                    />
                ))}
            </div>

            <Lightbox
                open={open}
                close={() => setOpen(false)}
                index={index}
                slides={slides}
            />
        </>
    );
}
