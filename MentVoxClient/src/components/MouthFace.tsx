// MouthFace.tsx

const MouthFace = ({ mouthOpen }: { mouthOpen: number }) => {
    const mouthHeight = 10 + mouthOpen * 40; // עד 50px גובה

    return (
        <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" stroke="black" strokeWidth="2" fill="#ffe0b2" />
            <circle cx="35" cy="40" r="5" fill="black" />
            <circle cx="65" cy="40" r="5" fill="black" />
            <ellipse
                cx="50"
                cy="70"
                rx="15"
                ry={mouthHeight / 2}
                fill="red"
                style={{ transition: "all 0.1s ease-out" }}
            />
        </svg>
    );
};

export default MouthFace;
