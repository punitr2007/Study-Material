# CUHK — MATH 2040C: Linear Algebra II
## Tutorial 5: Abstract Vector Spaces & Midterm Review

**Course:** Linear Algebra II (Theoretical / Honours Stream)  
**Institution:** The Chinese University of Hong Kong (CUHK)

---

### Key Topic 1: Polynomial Basis Change & Representation (Set 1 Q3 Style)
Let $V = P_2(\mathbb{R})$. Consider the basis $\beta = \{1, x, x^2\}$ and the shifted basis $\gamma = \{1, x-a, (x-a)^2\}$ for some $a \in \mathbb{R}$.
1. Express $p(x) = c_0 + c_1 x + c_2 x^2$ in the basis $\gamma$ using Taylor expansion around $x = a$:
   $$p(x) = p(a) + p'(a)(x-a) + \frac{p''(a)}{2!}(x-a)^2$$
2. Construct the change-of-basis matrix $Q_{\beta \to \gamma}$.

---

### Key Topic 2: Linear Maps and Matrix Spaces
Let $M_{2\times 2}(\mathbb{R})$ be the vector space of $2\times 2$ real matrices. Fix a matrix $A \in M_{2\times 2}(\mathbb{R})$ and define the map $T: M_{2\times 2}(\mathbb{R}) \to M_{2\times 2}(\mathbb{R})$ by:
$$T(X) = AX - XA$$
1. Prove that $T$ is linear:
   $$T(cX + Y) = A(cX + Y) - (cX + Y)A = c(AX - XA) + (AY - YA) = cT(X) + T(Y)$$
2. Show that $\ker(T)$ contains at least all scalar multiples of the identity matrix $I_2$.
3. Compute $\dim(\ker T)$ and $\operatorname{rank}(T)$ for $A = \begin{pmatrix} 0 & 1 \\ 0 & 0 \end{pmatrix}$.
