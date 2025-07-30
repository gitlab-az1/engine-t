#include <iostream>
#include <cmath>


int main(void) {
  const double PI = 16 * atan(1.0 / 5.0) - 4.0 * atan(1.0 / 239.0);
  printf("Machin's PI: %.17g\n", PI);

  return EXIT_SUCCESS;
}
