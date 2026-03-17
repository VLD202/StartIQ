def calculate_final_score(data: dict):
    weights = {
        "idea": 0.25,
        "market": 0.20,
        "competitor": 0.15,
        "finance": 0.20,
        "risk": 0.20
    }

    overall = (
        data["idea"]["score"] * weights["idea"] +
        data["market"]["score"] * weights["market"] +
        data["competitor"]["score"] * weights["competitor"] +
        data["finance"]["score"] * weights["finance"] +
        data["risk"]["score"] * weights["risk"]
    )

    if overall >= 80:
        rating = "Investment Ready 🚀"
        investment_ready = True
    elif overall >= 65:
        rating = "Seed Ready 🌱"
        investment_ready = False
    elif overall >= 50:
        rating = "MVP Stage ⚙️"
        investment_ready = False
    else:
        rating = "Not Ready ❌"
        investment_ready = False

    return {
        "overall_score": round(overall, 2),
        "investment_ready": investment_ready,
        "rating": rating,
        "idea": data["idea"]["score"],
        "market": data["market"]["score"],
        "finance": data["finance"]["score"],
        "risk": data["risk"]["score"],
        "competitor": data["competitor"]["score"]
    }