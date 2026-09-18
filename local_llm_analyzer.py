#!/usr/bin/env python3
"""
Local LLM Academic Analysis & Solution Assistant
Interfaces with local LLM server at http://localhost:1234
Supports /api/v1/chat and /v1/chat/completions for qwen/qwen3.5-9b and other models.
"""

import os
import sys
import json
import urllib.request
import urllib.error
from pathlib import Path

DEFAULT_MODEL = "qwen/qwen3.5-9b"
BASE_URL = "http://localhost:1234"

def query_local_llm(prompt: str, system_prompt: str = "You are an expert engineering professor providing detailed, accurate, step-by-step academic solutions.", model: str = DEFAULT_MODEL, timeout: int = 60) -> str:
    """
    Calls the local LLM endpoint (supporting both /api/v1/chat and /v1/chat/completions fallback).
    """
    # Try 1: /api/v1/chat (Native format)
    endpoint_api = f"{BASE_URL}/api/v1/chat"
    payload_api = {
        "model": model,
        "system_prompt": system_prompt,
        "input": prompt
    }
    
    try:
        req = urllib.request.Request(
            endpoint_api,
            data=json.dumps(payload_api).encode('utf-8'),
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            if "output" in res_data:
                out = res_data["output"]
                if isinstance(out, list):
                    texts = []
                    for item in out:
                        if isinstance(item, dict) and item.get("type") == "message":
                            texts.append(item.get("content", ""))
                        elif isinstance(item, str):
                            texts.append(item)
                    return "\n".join(texts)
                return str(out)
            if "choices" in res_data and len(res_data["choices"]) > 0:
                return res_data["choices"][0]["message"]["content"]
            if "response" in res_data:
                return res_data["response"]
            if "message" in res_data:
                return res_data["message"]
            return json.dumps(res_data, indent=2)
    except Exception as e_api:
        # Fallback to OpenAI-compatible endpoint /v1/chat/completions
        endpoint_oa = f"{BASE_URL}/v1/chat/completions"
        payload_oa = {
            "model": model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2
        }
        try:
            req2 = urllib.request.Request(
                endpoint_oa,
                data=json.dumps(payload_oa).encode('utf-8'),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req2, timeout=timeout) as response2:
                res_data2 = json.loads(response2.read().decode('utf-8'))
                return res_data2["choices"][0]["message"]["content"]
        except Exception as e_oa:
            return f"[Error querying local LLM at {BASE_URL}: {e_api} / {e_oa}]"


def analyze_topic(subject_name: str, topic_name: str):
    print(f"\n[+] Analyzing Topic '{topic_name}' for subject '{subject_name}' via Local LLM ({DEFAULT_MODEL})...\n")
    system_prompt = f"You are a university professor in {subject_name}. Provide a concise high-yield exam breakdown with key formulas, common pitfalls, and past question patterns."
    prompt = f"Provide a complete, exam-focused analysis of the topic: '{topic_name}' under '{subject_name}'. Include standard derivations, key formula sheet in LaTeX, and guaranteed question variations."
    
    result = query_local_llm(prompt, system_prompt=system_prompt)
    print(result)
    return result


if __name__ == "__main__":
    if len(sys.argv) > 2:
        subject = sys.argv[1]
        topic = " ".join(sys.argv[2:])
        analyze_topic(subject, topic)
    else:
        print("Usage: python3 local_llm_analyzer.py \"<Subject Name>\" \"<Topic Name>\"")
        print("Example: python3 local_llm_analyzer.py \"Signals and Systems\" \"Graphical Convolution\"")
