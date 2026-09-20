# MIT 18.700 — Linear Algebra (Axler Style)
## Topic Review: Defining Linear Maps on a Basis, Kernel, Image, and Map Counting

**Textbook Reference:** *Linear Algebra Done Right* by Sheldon Axler  
**Key Conceptual Focus:** Action of linear maps on bases, determining existence, and counting linear transformations.

---

### 🔷 Concept 1: Fundamental Theorem of Linear Maps
**Theorem:** Let $v_1, \dots, v_n$ be a basis of $V$, and let $w_1, \dots, w_n$ be arbitrary vectors in $W$. Then there exists a **unique** linear map $T: V \to W$ such that:
$$T(v_j) = w_j \quad \text{for } j = 1, \dots, n$$

#### Problem 1 (Existence of Linear Transformation — Set 1 Q4 Style)
Does there exist a linear map $T: \mathbb{R} \to \mathbb{R}$ such that $T(2) = 4$ and $T(5) = 25$?
* **Proof / Reasoning:**
  * For any linear map $T: \mathbb{R} \to \mathbb{R}$, $T(cx) = cT(x)$ for all scalars $c \in \mathbb{R}$.
  * In particular, taking $x = 1$, we have $T(x) = kx$ where $k = T(1)$.
  * $T(2) = 2k = 4 \implies k = 2$.
  * Then $T(5)$ must equal $2 \times 5 = 10$.
  * Since $T(5) = 25 \neq 10$, **no such linear map exists**.

---

### 🔷 Concept 2: Counting Linear Maps (Set 2 Q4 Style)
Let $V$ and $W$ be finite-dimensional vector spaces over a finite field $\mathbb{F}_q$, or with specific constraint equations.

#### Problem 2.1 (Counting Linear Maps with Specified Kernel)
Let $V$ be a 3-dimensional vector space over $\mathbb{F}_2$ (the field with 2 elements).
1. How many distinct linear maps $T: V \to V$ exist?
   * Total linear maps $= |\mathbb{F}_2|^{3 \times 3} = 2^9 = 512$.
2. How many linear maps $T: V \to V$ have $\dim(\ker T) = 1$?
   * By Rank-Nullity, $\dim(\operatorname{im} T) = 3 - 1 = 2$.

#### Problem 2.2 (Linear Maps Between Non-Standard Spaces — Set 2 Q3 Style)
Consider the additive group of reals $(\mathbb{R}, +)$ and the multiplicative group of positive reals $(\mathbb{R}^+, \cdot)$ where $\oplus$ is multiplication ($x \oplus y = xy$) and $\odot$ is power ($a \odot x = x^a$).
Show that the map $T: (\mathbb{R}, +) \to (\mathbb{R}^+, \oplus)$ defined by $T(x) = e^x$ is a linear transformation:
1. $T(x + y) = e^{x+y} = e^x \cdot e^y = T(x) \oplus T(y)$.
2. $T(ax) = e^{ax} = (e^x)^a = a \odot T(x)$.
3. $\ker(T) = \{ x \in \mathbb{R} \mid T(x) = \mathbf{0}_{\mathbb{R}^+} \}$. Since $\mathbf{0}_{\mathbb{R}^+} = 1$, $e^x = 1 \implies x = 0$. Hence $\ker(T) = \{0\}$ and $T$ is injective.
4. $\operatorname{im}(T) = \{ e^x \mid x \in \mathbb{R} \} = \mathbb{R}^+$, so $T$ is surjective (an isomorphism).
