import os
from .utils import extract_text
from openai import OpenAI
from sentence_transformers import SentenceTransformer, util

import json

# Initialize OpenAI client and embedding model
_openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY", ""))
_sim_model = SentenceTransformer('all-MiniLM-L6-v2')

def _generate_resume_brief(text: str) -> str:
    prompt = (
        "You are a helpful assistant specialized in HR recruitment. "
        "Summarize the following resume into a brief professional summary of key skills, "
        "experience, and technologies used:\n\n"
        f"{text}\n\nBrief Summary:"
    )
    response = _openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=300
    )
    return response.choices[0].message.content.strip()

def _calculate_similarity(text1: str, text2: str) -> float:
    emb1 = _sim_model.encode(text1, convert_to_tensor=True)
    emb2 = _sim_model.encode(text2, convert_to_tensor=True)
    return util.pytorch_cos_sim(emb1, emb2).item()

def _extract_skills(text: str) -> list:
    prompt = (
        "You are a helpful assistant specialized in HR recruitment. "
        "Extract the four most relevant skills from the following resume text and output them as a JSON list named skills, with no additional commentary:\n\n"
        f"{text}\n\n"
        "Output JSON format, e.g.: {\"skills\": [\"skill1\", \"skill2\", \"skill3\", \"skill4\"]}"
    )
    response = _openai_client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.0,
        max_tokens=60
    )
    content = response.choices[0].message.content.strip()
    try:
        data = json.loads(content)
        return data.get("skills", [])[:4]
    except:
        return []

def score_resume(pdf_bytes: bytes, description: str) -> dict:
    """
    Screen a resume PDF against a job description by:
      1. Extracting text from PDF bytes
      2. Generating a resume summary via OpenAI
      3. Computing a semantic similarity score against the description
    Returns a dict with:
      - summary: generated summary
      - score: similarity float
      - details: lengths of text and description
    """
    # 1. Extract raw text
    text = extract_text(pdf_bytes)

    # 2. Generate brief summary via OpenAI
    summary = _generate_resume_brief(text)

    # 3. Compute similarity score
    score = _calculate_similarity(summary, description)

    # 4. Extract top 4 skills
    skills = _extract_skills(summary)
    skills_str = ", ".join(skills)
    
    return {
        "resumeScore": score,
        "skills": skills_str
    }
