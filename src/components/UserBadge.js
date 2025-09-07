import firstLevel from "../files/icons/firstLevel.png";
import secondLevel from "../files/icons/secondLevel.png";
import thirdLevel from "../files/icons/thirdLevel.png";
import fourthLevel from "../files/icons/fourthLevel.png";



export const UserBadge = ({ points }) => {

    const getBadge = (points) => {
        const pts = Number(points || 0);

        if (pts < 70) return firstLevel;
        else if (pts <= 199) return secondLevel;
        else if (pts <= 450) return thirdLevel;
        else return fourthLevel;
    }

    const badge = getBadge(points);

    return (
        <img
            src={badge}
            alt="userLevel"
            style={{
                position: "absolute",
                bottom: -15,
                left: 0,
                width: 18,
                height: 18,
                padding: "4px",
                borderRadius: "50%",
                backgroundColor: "#ffffffff"
            }}
        />
    )
}
