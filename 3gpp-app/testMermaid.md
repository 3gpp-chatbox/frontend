 <!-- correct one -->
 ```mermaid
    graph TD;
        A-->B;
        A-->C;
        B-->D;
        C-->D;
```
 ```mermaid
flowchart TD
    1[Registration Procedure]
    2[Registration Request]
    3[Registration Accept]
    4[Registration Complete]
    1-->|SENDS|2
    2-->|TRIGGERS|3
    3-->|FOLLOWED_BY|4
```
 