import React from "react";
import "styles/start.css";
import {useState} from "react"

export default function Start({hostName,onlineCount}){
  return(
        <div className="/start">
              <div className="child">
                  <div> {hostName} さんのあだ名を考えよう！</div>
                  <div>メンバーが集まるまで待ってね</div>
                  <div>現在の人数：{onlineCount}人</div>
              </div>
        </div>
  );
}
